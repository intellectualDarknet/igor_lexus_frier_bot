const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require("./options")
const token = '7393288439:AAGCO7Lzvw1iYt2TlaMaoUuDjV38VuMW9Dw'

const bot = new TelegramApi(token, { polling: true })
const chats = {}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получение информации' },
    { command: '/game', description: 'Простая игра' }
  ])
  
  bot.on('message', async (msg) => {
    console.log(msg)
  
    const text = msg.text
    const chatId = msg.chat.id
  
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.webp')
      return bot.sendMessage(chatId, `Добро пожаловать в бот igor lexus frier`)
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.username}`)
    }

    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, `Я тебя не понимаю попробуй еще раз!!!`)
  })

  bot.on('callback_query', async (msg) => {
    console.log('callback query message', msg)
    const data = msg.data
    const chatId = msg.message.chat.id

      if (data == '/again') {
        return startGame(chatId)
      }
    
      if (chats[chatId] == data) {
        delete chats[chatId]
        return bot.sendMessage(chatId, `Поздравляю ты угадал цифру ${data}`, againOptions)
      } else {
        return bot.sendMessage(chatId, `К сожалению ты не угадал бот загадал ${chats[chatId]}`, againOptions)
      }
  })
}

start()

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9 a ты попробуешь угадать')
  const value = Math.round(Math.random() * 9)
  chats[chatId] = value
  return bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}