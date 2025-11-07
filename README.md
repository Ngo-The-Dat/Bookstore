### Cách compile:
```bash 
npm run dev
```

* Mỗi khi save file, nó sẽ tự động compile lại.

* Lệnh này sẽ tự động chạy file ```script.js```. Muốn thay đổi file chạy thì ta vào package.json sửa lại dòng dưới đây
```bash
"scripts": {
    "dev": "nodemon script.js"
  }
```
VD: muốn chạy file ```app.js``` thì sửa lại thành
```bash
"scripts": {
    "dev": "nodemon app.js"
  }

