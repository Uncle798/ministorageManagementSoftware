import satori from 'satori';
import {html as toReactNode } from 'satori-html'
import { Resvg } from '@resvg/resvg-js';
import NotoSans from '$lib/NotoSans-Regular.ttf'
import type { RequestHandler } from './$types';
import { read } from '$app/server';
import OgCard from '$lib/displayComponents/OgCard.svelte';
import { render } from 'svelte/server';

const fontData = read(NotoSans).arrayBuffer();
const height = 630;
const width = 1200;

export const GET: RequestHandler = async ({url}) => {
   const message = url.searchParams.get('message') ?? undefined;
   const element = render(OgCard, {props: {message: message}});
   const jsx = toReactNode(element.body)
   const svg = await satori(jsx, {
      fonts: [
         {
            name: 'Noto Sans',
            data: await fontData,
            style: 'normal'
         }
      ],
      height,
      width,
   });
   const resvg = new Resvg(svg, {
      fitTo: {
         mode: 'width',
         value: width
      }
   })
   const image = resvg.render();

   return new Response(image.asPng(), {
      headers: {
         'content-type': 'image/png'
      }
   });
};