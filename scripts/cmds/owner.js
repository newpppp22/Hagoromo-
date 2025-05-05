const fs = require("fs");
const axios = require("axios");
const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
  config: {
    name: "owner",
    aliases: ["info", "profile"],
    author: "Amit Max ⚡",
    role: 0,
    shortDescription: "Show owner's profile with playable video",
    longDescription: "Displays profile info and sends a playable video directly.",
    category: "profile",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

    const profile = `
『 Owner ⚡ Profile 』

╭───────────────────────────────⭓
│ ➤ Name           : Hagoromo Otustsuki 
│ ➤ Class          : Honours 1st year 
│ ➤ Group          : Political Science
│ ➤ Gender         : Male
│ ➤ Birthday       : Unknown 
│ ➤ Religion       : Islam 
│ ➤ Blood Group    : B+ 
│ ➤ Height         : 5.6 Feet
│ ➤ Location       : Faridpur 
│ ➤ Hobby          : Graphics design, Video editing, Gaming etc 
│ ➤ Relationship   : Single
│ ➤ Facebook       : https://fb.me/share/1FdFeKVAMy
│ ➤ Instagram      : Unknown
│ ➤ Email          : new0gmai@gmail.com
╰───────────────────────────────⭓

⏰ Time: ${time}`;

    const videoUrl = "https://i.imgur.com/tLWu7FU.mp4";
    const videoPath = __dirname + "/owner_profile_video.mp4";

    try {
      const res = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(videoPath, Buffer.from(res.data, "utf-8"));

      api.sendMessage({
        body: profile,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, (err, info) => {
        fs.unlinkSync(videoPath); // Delete local video file
        if (!err) {
          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, 25000); // Delete after 25 seconds
        }
      });

    } catch (e) {
      // If video can't be sent, send profile text only
      api.sendMessage(profile, event.threadID);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: false });
