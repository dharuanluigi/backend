import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { parseStringHoursToMinutes } from "./utils/parseStringHourToMinutes";
import { parseStringMinutesToHourString } from "./utils/parseStringMinutesToHourString";

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });

  return res.json(games);
});

app.get("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  return res.json(
    ads.map((ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(","),
        hourStart: parseStringMinutesToHourString(ad.hourStart),
        hourEnd: parseStringMinutesToHourString(ad.hourEnd),
      };
    })
  );
});

app.get("/ads/:adId/discord", async (req, res) => {
  const adId = req.params.adId;

  const discord = await prisma.ad.findFirstOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });

  return res.json(discord);
});

app.post("/games/:gameId/ads", async (req, res) => {
  const gameId = req.params.gameId;
  const body: any = req.body;

  const newAd = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(","),
      hourStart: parseStringHoursToMinutes(body.hourStart),
      hourEnd: parseStringHoursToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });

  res.status(201).json(newAd);
});

app.listen(3000, () => console.log("It's alive!"));
