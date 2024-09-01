const pl = require("physics-lab-web-api");
const axios = require("axios");

const user = new pl.User(process.env.ADMIN, process.env.PASSWORD); // 物实用户名&密码

axios.interceptors.request.use((request) => {
  // console.log("Starting Request\n", request, "-".repeat(10), "\n\n");
  // 这里会打印详细的请求信息
  return request;
});

async function sendLetters(projects, authors, type, user) {
  try {
    const response = await axios.post(
      "http://physics-api-cn.turtlesim.com/Messages/SendMessages",
      {
        TargetID: authors,
        SummaryID: projects,
        TemplateID: "Letter-Featured-Curated",
        Category: type,
      },

      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "zh-CN",
          "x-API-Token": user.token,
          "x-API-AuthCode": user.authCode,
          "x-API-Version": "2411",
        },
      }
    );
    return response.data;
  } catch (e) {
    console.warn(e.message);
  }
}

async function main(type) {
  await user.auth.login();
  const projects = require("./data/test.list"); //收件人，目前为测试作品
  const authors = [];
  for (const id of projects[type]) {
    const re = await user.projects.getSummary(id, type);
    authors.push(re.Data.User.ID);
  }
  const re = await sendLetters(projects[type], authors, type, user);
  console.log(re);
}

main("Discussion");
// main("Experiment");
