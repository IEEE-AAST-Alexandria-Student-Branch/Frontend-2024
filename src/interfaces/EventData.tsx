import firebase from "firebase/compat/app";
import { socialLinks } from "../components/EventDetails/Types";

export interface EventData {
    title: string;
    description: string;
    starttime: firebase.firestore.Timestamp;
    endtime: firebase.firestore.Timestamp;
    coverPhoto: string;
    gallery: string[];
    keynotes: Inote[];
    schedule: Schedule;
    speakers: string[];
    sponsors: string[];
    type: string;
    videos: Ivideo[];
    formLink?:string;
}
export interface Schedule{
    duration: string;
    speaker: string;
    starting : string;
    title : string;
}

export interface Ivideo{
    length: string;
    name: string;
    speaker: string;
    thumbnail: string | null | undefined;
    url: string;
}

export interface Inote {
    name: string;
    thumbnail: string | null | undefined;
    url: string;
}

export interface IResources {
    videos: Ivideo[];
    notes: Inote[];
}

export interface Isponsor {
    name: string;
    imgurl: string;
    socials: socialLinks;
    totaleventssponsered: number;
}

export interface IsponsorsIds{
    sponsorIds: string[];
}

export interface IspksIds {
    speakersIds: string[];
}

export interface IsocialLinks {
    name: string;
    url: string;
}

export interface Ispk {
    name: string;
    imgurl: string;
    bio: string;
    socials: socialLinks;
}


export interface scheduleItem {
    title: string;
    speaker: string;
    starting: string;
    duration: string;
}

export interface scheduleItems{
    schedules: scheduleItem[];
}