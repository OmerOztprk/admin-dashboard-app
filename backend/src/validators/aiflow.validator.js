const yup = require("yup");

const streamChatSchema = yup.object({
  data: yup.object({
    message: yup.string().required("Mesaj alanı zorunludur."),
    customPrompt: yup.string().nullable(),
    sessionId: yup.string().nullable(),
  }).required("Data alanı zorunludur."),
});

module.exports = {
  streamChatSchema,
};
