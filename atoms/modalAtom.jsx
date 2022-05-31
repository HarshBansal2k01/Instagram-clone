// similar as redux and its parts but easier to create
import { atom } from "recoil";

export const modalState = atom({
    key: 'modalState',
    default: false,
});