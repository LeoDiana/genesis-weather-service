import express from "express";
import { subscribe } from "../controllers/subscription.controller";
import {confirmSubscription} from "../controllers/confirm.controller";
import {unsubscribe} from "../controllers/unsubscribe.controller";

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/unsubscribe/:token", unsubscribe);
router.get("/confirm/:token", confirmSubscription);

export default router;