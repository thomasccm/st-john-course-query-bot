const https = require('https');
const querystring = require('querystring');
const cheerio = require('cheerio');
const root = process.cwd();
const logger = require(`${root}/src/util/logger`)();
const {
  isPrivateChat,
} = require(`${root}/src/util/privilege`);
const {
  CommandConstructor,
} = require(`${root}/src/handlers/command_event/commandConstructor`);
const {
  translate,
} = (languageHandler = require(`${root}/src/handlers/languageHandler`));

class CommandEventHandler {
  constructor(bot, botUsername) {
    this.bot = bot;
    this.botUsername = botUsername;
    this.load();
  }

  load() {
    const commandConstructor = new CommandConstructor(
      this.bot,
      this.botUsername
    );
    commandConstructor.newCommand("start", query);
    commandConstructor.newCommand("help", getHelp);
  }
}

module.exports = {
  CommandEventHandler,
};

function httpsPost({body, ...options}) {
  return new Promise((resolve,reject) => {
    const req = https.request({
      method: 'POST',
      ...options,
    }, res => {
      const chunks = [];
      res.on('data', data => chunks.push(data));
      res.on('end', () => {
        let body = Buffer.concat(chunks);
        switch(res.headers['content-type']) {
          case 'application/json':
            body = JSON.parse(body);
            break;
        }
        resolve(body);
      })
    })
    req.on('error',reject);
    if(body) {
      req.write(body);
    }
    req.end();
  })
}

async function query(ctx) {
  if (!isPrivateChat) {
    return;
  }

  var chatId = ctx.message.from.id;
  const hostname = "ereg.stjohn.org.hk";
  const method = "POST";
  const postData = querystring.stringify({
    'string': 'mode::default##page::1##pageSize::-1##courseType::ODRC##district::-1##courseName::##weekDate::-1##courseLanguage::-1##isExam::##tableCols::11##'
  });

  const res = await httpsPost({
    rejectUnauthorized: false,
    hostname: hostname,
    path: `/schedule/loadList.html`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      'Content-Length': Buffer.byteLength(postData),
    },
    body: postData
  });
  // logger.debug(res.toString('utf-8'));

  // map http resp into json
  const $ = cheerio.load(`<table>${res.toString('utf-8')}</table>`);
  var courseList = [];
  var hasVacancy = 0;
  $("tr").each((index, element) => {
    const ths = $(element).find("th");
    if (ths.length == 12) {
      courseList.push({
        'courseCategory': $(ths[0]).text(),
        'courseCode':     $(ths[1]).text(),
        'courseDate':     $(ths[2]).text(),
        'courseWeekday':  $(ths[3]).text(),
        'courseTime':     $(ths[4]).text(),
        'location':       $(ths[5]).text(),
        'examDate':       $(ths[6]).text(),
        'examTime':       $(ths[7]).text(),
        'dayCount':       $(ths[8]).text(),
        'lang':           $(ths[9]).text(),
        'vacancy':        $(ths[10]).text(),
        'link':           hostname + $(ths[11]).find('a').first().attr('href'),
      });
      if ($(ths[10]).text() > 0) {
        hasVacancy++;
      }
    }
  });
  // logger.debug(courseList);

  const extra = {
    parse_mode: 'HTML', 
    disable_web_page_preview: true,
  };
  // form message body
  var msg = '';
  if (courseList.length) {
    courseList.forEach((couese, index) => {
      msg += `#${index+1}\n`
        + `??????: ${couese.courseCategory}\n`
        + `????????????: ${couese.courseCode}\n`
        + `????????????: ${couese.vacancy}\n`
        + `????????????: ${couese.courseDate} \(${couese.courseWeekday}\) \n`
        + `????????????: ${couese.courseTime}\n`
        + `????????????: ${couese.location}\n`
        + `????????????: ${couese.examDate}\n`
        + `????????????: ${couese.examTime}\n`
        + `????????????: ${couese.lang}\n`
        + (couese.vacancy > 0 ? `<a href="${couese.link}">??????</a>\n` : `????????????\n`);
      msg += (index != courseList.length - 1)
        ? `\n???????????????????????????????????????????????????????????????????????????\n\n`
        : `\n???????????????????????????????????????????????????????????????????????????\n`
        + `?????? ${courseList.length} ???, ${hasVacancy} ?????????\n`
        + `\n???`;
      if ((index + 1)%10 == 0 && index != courseList.length - 1) {
        // send message back
        ctx.telegram.sendMessage(chatId, msg, extra);
        msg = '';
      }
    });
  } else {
    msg = '?????????';
  }

  // send message back
  ctx.telegram.sendMessage(chatId, msg, extra).then(resp => {
    // logger.debug(JSON.stringify(payload));
    setTimeout(function() {
      ctx.telegram.sendMessage(chatId, `??????????????? /start ?????????, ??????!`, extra)
    }, 750);
  });
}

function getHelp(ctx) {
  if (!isPrivateChat) {
    return;
  }

  var chatId = ctx.message.from.id;

  var msg = '- /start ???St. John??????????????????';
  msg += '\n- /help ????????????';

  ctx.telegram.sendMessage(chatId, msg);
}