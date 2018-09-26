const urlExists = require("util").promisify(require("url-exists"));
const { Router } = require("express");
const router = new Router();
const Url = require("./url-model");

const randomId = _ =>
  Math.random()
    .toString(16)
    .slice(2, 6);

//error handlers
const duplicateErrCode = 11000;

const send404 = res => res.status(404).json({ error: "not found" });
const send500 = res => res.status(500).json({ error: "internal server error" });
const duplicateError = res =>
  res.status(400).json({ error: "can't make duplicate urls" });
const invalidUrl = res => res.status(400).json({ error: "invalid URL" });

async function createUrl({ body: { url } }, res) {
  if (await urlExists(url)) {
    Url.create({
      original_url: url,
      short_url: randomId()
    })
      .then(({ original_url, short_url }) =>
        res.json({
          original_url,
          short_url
        })
      )
      .catch(
        error =>
          error.code === duplicateErrCode ? duplicateError(res) : send500(res)
      );
  } else invalidUrl(res);
}

const redirectToOriginal = ({ params: { short_url } }, res) =>
  Url.findOne({ short_url })
    .then(url => (url ? res.redirect(url.original_url) : send404(res)))
    .catch(_ => send500(res));

router.post("/new", createUrl);
router.get("/:short_url", redirectToOriginal);
module.exports = router;
