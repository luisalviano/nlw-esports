import express from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes';
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string';

const app = express();
const prisma = new PrismaClient({
  log: ['query']
});

app.use(express.json());
app.use(cors());

app.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: { ads: true }
      }
    }
  });

  return response.json(games);
})

app.post('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;
  const adInfo = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: adInfo.name,
      yearsPlaying: adInfo.yearsPlaying,
      discord: adInfo.discord,
      weekdays: adInfo.weekdays.join(','),
      hourStart: convertHourStringToMinutes(adInfo.hourStart),
      hourEnd: convertHourStringToMinutes(adInfo.hourEnd),
      useVoiceChannel: adInfo.useVoiceChannel
    }
  });

  return response.status(201).json(ad);
})

app.get('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekdays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true
    },
    where: { gameId },
    orderBy: { createdAt: 'desc' }
  });

  return response.json(ads.map(ad => {
    return {
      ...ad,
      weekdays: ad.weekdays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd)
    }
  }))
});

app.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: { discord: true },
    where: { id: adId }
  })

  return response.json({ discord: ad.discord });
});

app.listen(3333);