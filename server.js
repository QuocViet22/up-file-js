/**
 * Created by trungquandev.com's author on 11/03/2019.
 * server.js
 */

let express = require("express");
let multer = require("multer");
let path = require("path");

let app = express();

// Route này trả về cái form upload cho client
app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/views/master.html`));
});

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    // thao tác với file
    let math = ["text/html"];
    // đặt tên file
    let filename = `${file.originalname}`;
    callback(null, filename);
  }
});

// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFile = multer({ storage: diskStorage }).single("file");

// Route này Xử lý khi client thực hiện hành động upload file
app.post("/upload", (req, res) => {
  // Thực hiện upload file, truyền vào 2 biến req và res
  uploadFile(req, res, (error) => {
    // Nếu có lỗi thì trả về lỗi cho client.
    if (error) {
      return res.send(`Error when trying to upload: ${error}`);
    }
    // Không có lỗi thì lại render cái file về cho client.
    // Đồng thời file đã được lưu vào thư mục uploads
    res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`));

    const fs = require('fs')
    fs.readFile(`${__dirname}/uploads/${req.file.filename}`, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(data)

      // RSA
      const NodeRSA = require('node-rsa');
      const key = new NodeRSA({ b: 512 });
      const text = data;
      const encrypted = key.encrypt(text, 'base64');
      console.log('encrypted: ', encrypted);
      const decrypted = key.decrypt(encrypted, 'utf8');
      console.log('decrypted: ', decrypted);
    })



    res.redirect('/');
  });
});

app.listen(8017, "localhost", () => {
  console.log(`Hello, I'm running at localhost:8017/`);
});