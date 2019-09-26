const { Wechaty       } =require('wechaty');
const { PuppetPadplus } =require('wechaty-puppet-padplus');
const { generate      } =require('qrcode-terminal');

const token = 'puppet_padplus_a7f679db7192b397';

const puppet = new PuppetPadplus({
  token,
})

const bot = new Wechaty({
  puppet,profile:'login'
});

let map=new Map();//用户猜词统计

let flag=false;//猜词标记
bot
  .on('scan', (qrcode, status) =>{ 
console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)})
  .on('message',async function(msg){
   // console.log(`msg : ${msg}`)
    const text=msg.text();
    const room =msg.room();
    const contact=msg.from();
     if(room){
        let topic = await room.topic();
        if(topic!=='A'){//如果不是a群则忽略
                return;
        }
        if(!flag&&text=='猜数字'){
                flag=true;//猜词开始
                random= Math.floor(Math.random () * 99) + 1;
                room.say('猜数字游戏开始');
        }
        if(parseFloat(text).toString() == "NaN"){//非数字，退出
                return;
        }
        if(map.get(contact)){
                map.set(contact,map.get(contact)+1);//统计用户的回答次数
        }else{
                map.set(contact,1);
        }
        if(text>random){
                room.say('大了',contact);
        }
        if(text<random){
                room.say('小了',contact);
        }
        if(text==random){
                let str="以下是大家的猜词统计:\n";
                for(let val of map){
                        str+=`${val[0].name()}: 猜词${val[1]}次\n`;
                }
                flag=false;//开始新的一轮猜数字
                room.say(`恭喜${contact.name()}，猜对了，就是${random}\n${str}`);
        }
      }
  })
  .start()

