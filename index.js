const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

// Thay thế bằng mã thông báo bot Telegram của bạn
const token = '7197126265:AAF9KZkadzutM1oGTjXmeWfHLMwrBS-QK3U';

// Khởi tạo bot bằng mã thông báo
const bot = new TelegramBot(token, { polling: true });

// Chức năng ghi lại hoạt động sử dụng bot vào nhật ký giao diện điều khiển
function logActivity(msg) {
    const user = msg.from;
    const chat = msg.chat;
    const command = msg.text.toLowerCase();

    console.log(`Hoạt động sử dụng Bot Telegram`);
    console.log(`• User ID: ${user.id}`);
    console.log(`• Username: ${user.username || 'không'}`);
    console.log(`• Chat ID: ${chat.id}`);
    console.log(`• Đặt hàng: ${command}`);
}

// Trình xử lý sự kiện cho tin nhắn từ người dùng
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const command = msg.text.toLowerCase();

    // Ghi lại hoạt động sử dụng bot vào nhật ký bảng điều khiển
    logActivity(msg);

    // Trả lời lệnh /mix
    if (command.startsWith('/mix')) {
        // Trích xuất các đối số từ tin nhắn
        const args = command.split(' ');
        const url = args[1];
        const time = args[2];
        const thread = args[3];
        const rate = args[4];

        // Kiểm tra xem định dạng tin nhắn có đúng không
        if (args.length === 5 && url && time && thread && rate) {
            // Chạy tệp mix.js với các đối số đã cho
            exec(`node mix.js ${url} ${time} ${thread} ${rate}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    bot.sendMessage(chatId, 'Successful');
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    bot.sendMessage(chatId, 'Successful');
                    return;
                }
                // Hiển thị đầu ra stdout nếu thành công
                console.log(`stdout: ${stdout}`);
                bot.sendMessage(chatId, 'Quá trình đã bắt đầu.');
            });
        } else {
            // Thông báo cho người dùng rằng định dạng tin nhắn không chính xác
            bot.sendMessage(chatId, 'Định dạng tin nhắn không chính xác. Sử dụng định dạng: /mix [url] [time] [thread] [rate]');
        }
    }
});