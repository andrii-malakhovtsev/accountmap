import express from "express";

const router = express.Router();

router.route("/bulk").post((req: any, res: any) => {
	console.log("api is here");
});

export default router;
