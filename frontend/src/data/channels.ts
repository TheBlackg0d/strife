import type {
  Member,
  Message,
  PrivateChannel,
} from "../pages/channel/types/channel";

export const currentUserId = "u0";

const userOne: Member = { userId: currentUserId, username: "UserOne" };
const cyberNinja: Member = { userId: "u1", username: "CyberNinja" };
const designArch: Member = { userId: "u2", username: "DesignArch" };
const devExpert: Member = { userId: "u3", username: "DevExpert" };
const auramemnon: Member = { userId: "u4", username: "Auramemnon" };
const theAlgerian: Member = { userId: "u5", username: "TheAlgerianDev" };

export const privateChannels: PrivateChannel[] = [
  { id: "c1", channelName: "CyberNinja", member: [userOne, cyberNinja] },
  { id: "c2", channelName: "DesignArch", member: [userOne, designArch] },
  {
    id: "c3",
    channelName: "Project Alpha Team",
    member: [userOne, auramemnon, theAlgerian],
  },
  { id: "c4", channelName: "DevExpert", member: [userOne, devExpert] },
];

export const channelMessages: Record<string, Message[]> = {
  c1: [
    {
      id: "m1",
      content: "Salut ! Tu es dispo pour la session de ce soir ?",
      sender: cyberNinja,
      timestamp: "2026-08-09T14:22:00Z",
    },
    {
      id: "m2",
      content:
        "J'ai trouvé une nouvelle route pour le speedrun, faut absolument qu'on teste ça.",
      sender: cyberNinja,
      timestamp: "2026-08-09T14:23:00Z",
    },
    {
      id: "m3",
      content: "Hey ! Ouais grave, je me co vers 20h.",
      sender: userOne,
      timestamp: "2026-08-09T14:25:00Z",
    },
    {
      id: "m4",
      content: "C'est sur quel niveau la nouvelle route ?",
      sender: userOne,
      timestamp: "2026-08-09T14:25:30Z",
    },
    {
      id: "m5",
      content:
        "Niveau 4, secteur de la raffinerie. On gagne au moins 15 secondes si on passe par les conduits d'aération.",
      sender: cyberNinja,
      timestamp: "2026-08-09T14:30:00Z",
    },
    {
      id: "m6",
      content: "Je t'enverrai la vidéo.",
      sender: cyberNinja,
      timestamp: "2026-08-09T14:31:00Z",
    },
  ],
  c3: [
    {
      id: "m7",
      content: "J'ai poussé la maquette du panneau de membres sur la branche.",
      sender: auramemnon,
      timestamp: "2026-08-10T09:12:00Z",
    },
    {
      id: "m8",
      content: "Nickel, je regarde ça après le stand-up.",
      sender: theAlgerian,
      timestamp: "2026-08-10T09:15:00Z",
    },
    {
      id: "m9",
      content: "Pensez à inviter Nova, elle reprend la partie temps réel.",
      sender: userOne,
      timestamp: "2026-08-10T09:18:00Z",
    },
  ],
};
