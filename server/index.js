const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 16547 }); // 随便开个端口

const { spawn } = require('child_process');

const RTMP_SERVER = 'rtmp://ip:1935/mylive/aaa';

wss.on('connection', (ws) => {
console.log(1)
  const ffmpeg = spawn('ffmpeg', [
    // 从 stdin 中读入视频数据
    '-i', '-',

    // 视频转码
    // 由于视频已经是 H.264 编码，可以直接复制copy
    // 若需要转码则填 libx264
    '-vcodec', 'copy',

    // 音频转码
    '-acodec', 'aac',
    //'-preset', 'ultrafast',
    // 输出为 flv 格式
    '-f', 'flv',

    // RTMP 服务器
    RTMP_SERVER
  ]);
try {
  ws.on('message', (msg) => {
    // 收到时 msg 的类型是 Buffer
    ffmpeg.stdin.write(msg);
  })
 
} catch (error) {
  console.log(error);
  ffmpeg.kill('SIGINT');
}
 
  ws.on('close', (e) => {
    // 断开链接即中断推流

    ffmpeg.kill('SIGINT');
  });

});