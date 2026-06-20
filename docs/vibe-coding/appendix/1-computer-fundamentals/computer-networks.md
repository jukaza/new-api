# Trinh duyet la mot He dieu hanh

::: tip Loi noi dau
Ban dung trinh duyet moi ngay -- xem video, doc tin tuc, lam viec truc tuyen. Nhung ban co bao gio tu hoi: **khi ban nhap mot dia chi vao thanh dia chi va nhan Enter, dieu gi xay ra phia sau?**

Bai viet nay se su dung vi du **"mua sam truc tuyen"** cuoc song, ket hop voi **qua trinh ky thuat thuc te**, de huong dan ban tung buoc hieu cach trinh duyet bien mot dong dia chi thanh trang web phong phu.
:::

**Bai viet nay se giup ban hoc gi?**

Sau khi hoc xong chuong nay, ban se lam chu luong trinh ky thuat hoan chinh tu nhap URL den hien thi trang, hieu cach trinh duyet va may chu phoi hop lam viec. Nhung kien thuc nay la nen tang de hoc API, giao dien, bao mat web va cac cong nghe khac.

| Chuong | Noi dung | Khai niem cot loi |
|-----|------|---------|
| **Chuong 1** | Phan tich URL | Cau truc va chuc nang cua URL |
| **Chuong 2** | Truy van DNS | Cach mien chuyen thanh dia chi IP |
| **Chuong 3** | Bat tay TCP | Cach thiet lap ket noi tin cay |
| **Chuong 4** | Giao tiep HTTP | Cach trinh duyet va may chu doi chuyen |
| **Chuong 5** | Render cua trinh duyet | Cach code bien thanh hinh anh |
| **Chuong 6** | Tinh vs Dong | Cach tao noi dung trang web |

---

## 0. Mo dau: Khoanh khac ban nhan Enter

::: tip Cau hoi cot loi
**Khi ban nhap URL vao trinh duyet va nhan Enter, dieu gi xay ra phia sau?** Tai sao mot so trang mo nhanh, mot so cham? Tai sao doi khi xuat hien loi "khong tim thay may chu"?
:::

### Vi du cuoc song: Mot chuyen mua sam truc tuyen

Tuong tuong ban dang thuc hien mot chyen **mua sam truc tuyen**. Toan bo qua trinh co the chia thanh 5 buoc:

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Buoc 1: Dien don hang**
Chon san pham, xac nhan dia chi nhan

</div>
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Buoc 2: Tim kho hang**
He thong tim kho hang cu the

</div>
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Buoc 3: Thiet lap kenh**
Xac nhan kho hang dang mo va co the gui hang

</div>
</div>

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Buoc 4: Kho hang gui hang**
Shipper giao goi den nha ban

</div>
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Buoc 5: Mo goi va trai nghiem**
Mo goi, thay san pham yeu thich

</div>
</div>

**Qua trinh truy cap trang web tuong tu nhu mua sam truc tuyen mot cach kinh ngac!**

<UrlToBrowserQuickStart />

---

## 1. Buoc dau tien: Dien "don hang" -- Phan tich URL

::: tip Cau hoi cot loi
**Tai sao URL co dang nhu vay?** `https://www.example.com:8080/path/page.html?id=123#section` -- nhung ky tu nay co y nghia gi?
:::

### Qua trinh thuc te: Trinh duyet phan tich URL

**URL (Uniform Resource Locator)** la "ma dinh vi san pham" cua trinh duyet. Khi ban nhap `https://www.example.com:8080/path/page.html?id=123#section`, trinh duyet phan tich ngay:

| Phan URL | Vi du | Vi du mua sam | Chuc nang ky thuat |
| -------------------------- | -------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| **Giao thuc** `https://` | Giao thuc truyen sieu van ban an toan | **Phuong thuc van chuyen**: giao hang mat (HTTPS) vs giao thuong thuong (HTTP) | Quyet dinh quy tac giao tiep |
| **Mien** `www.example.com` | Ten doc duoc cua may chu | **Ten cua hang** | Chi trinh duyet tim may chu nao |
| **Cong** `:8080` | So "cong" cu the cua may chu | **So quay**: Quay so 3 (mac dinh khong viet) | Chi dinh truy cap dich vu nao tren may chu |
| **Duong dan** `/path/page.html` | Vi tri tep tren may chu | **Vi tri tren ke**: Khu do gia dung / Hang thu 3 | Chi dinh vi tri tai nguyen cu the |
| **Tham so truy van** `?id=123` | Thong tin bo sung | **Ghi chu don hang**: mau do, size XL | Du lieu gui them den may chu |
| **Neo** `#section` | Vi tri trong trang | **Trang sach**: mo den trang 5 | Cuon tu dong, khong gui den may chu |

<UrlParserDemo />

---

## 2. Buoc thu hai: Tra cuu "so dia chi" -- Truy van DNS

::: tip Cau hoi cot loi
**Tai sao trinh duyet tim thay trang web?** Ban nhap mien doc duoc (nhu `baidu.com`), nhung may tinh can dia chi so (IP). Dieu gi xay ra o giua?
:::

### Qua trinh thuc te: Truy van phan cap DNS

**DNS (Domain Name System)** la "he thong tra cuu danh ba phan tan" cua Internet.

```
Ban (trinh duyet)
    ↓ Hoi: IP cua google.com la gi?
May chu DNS dia phuong (nha cung cap dich vu mang)
    ↓ Hoi: Ai quan ly .com?
May chu DNS goc (13 nhom tren toan cau)
    ↓ Noi: hoi nguoi quan ly .com
May chu DNS mien cap cao nhat
    ↓ Noi: hoi nguoi quan ly google.com
May chu DNS uy thac
    ↓ Noi: IP cua google.com la 142.250.80.46
Tra ve IP cho trinh duyet
```

<DnsLookupDemo />

---

## 3. Buoc thu ba: Goi dien xac nhan -- Bat tay TCP ba lan

::: tip Cau hoi cot loi
**Tai sao can "bat tay ba lan"?** Sau khi tim thay dia chi may chu, tai sao khong gui du lieu truc tiep?
:::

### Qua trinh thuc te: Bat tay TCP ba lan

**TCP (Transmission Control Protocol)** la giao thuc dam bao truyen du lieu tin cay. Truoc khi truyen du lieu, phai thiet lap ket noi thong qua "bat tay ba lan":

```
May khach (may tinh cua ban)              May chu (kho hang)
   |                                |
   |--- SYN=1 --------------------->|  Lan 1: Xin chao, toi o nha, san sang nhan! (SYN)
   |                                |
   |<-- SYN=1, ACK=1 ---------------|  Lan 2: Da nhan! Toi cung san sang gui. Ban o nha khong? (SYN-ACK)
   |                                |
   |--- ACK=1 --------------------->|  Lan 3: Co! Xin hay gui. (ACK)
   |                                |
   ===== Kenh duoc thiet lap, bat dau gui =====
```

<TcpHandshakeDemo />

---

## 4. Buoc thu tu: Doi chuyen giua "nguoi mua" va "nguoi ban" -- HTTP

::: tip Cau hoi cot loi
**Trinh duyet va may chu dang noi gi?** Sau khi thiet lap ket noi, trinh duyet bao may chu muon gi nhu the nao?
:::

### Qua trinh thuc te: Giao thuc HTTP

**HTTP (HyperText Transfer Protocol)** la "quy tac doi chuyen" giua trinh duyet va may chu.

**Ma trang thai HTTP:**

| Ma | Y nghia | Vi du cuoc song |
| ----------- | ---------- | ---------------- | -------------------------------- |
| **200** | Thanh cong | "Don hang da xac nhan, gui ngay" |
| **301/302** | Chuyen huong | "Cua hang da chuyen, vui long dat tai dia chi moi" |
| **304** | Khong thay doi | "Hang ban mua van dung, khong gui lai" |
| **400** | Loi may khach | "Don hang roi, khong hieu" |
| **401** | Chua xac thuc | "Vui long xuat the thanh vien" |
| **403** | Cam truy cap | "Nhan vien noi bo moi duoc vao" |
| **404** | Khong tim thay | "Kho khong co san pham nay" |
| **500** | Loi may chu | "Kho hoang, tam thoi khong gui duoc" |
| **503** | Dich vu khong kha dung | "Don qua nhieu, tam dung nhan don" |

<HttpExchangeDemo />

---

## 5. Buoc thu nam: Mo "goi hang" -- Render cua trinh duyet

::: tip Cau hoi cot loi
**Code bien thanh hinh anh nhu the nao?** May chu gui code HTML/CSS/JavaScript nhiet nhan, trinh duyet bien chung thanh trang web phong phu nhu the nao?
:::

### Qua trinh thuc te: Dong co render cua trinh duyet

Trinh duyet nhan **code HTML/CSS/JavaScript**, nhung phai bien thanh **hinh anh pixel**. Qua trinh nay goi la **render (Rendering)**.

1. Phan tich HTML → xay dung cay DOM
2. Phan tich CSS → xay dung cay CSSOM
3. Ket hop → Cay render
4. Layout (Reflow) -- Do luong kich thuoc
5. Paint -- To mau
6. Composite -- Trinh bay cuoi cung

<BrowserRenderingDemo />

---

## 5.5 Trang tinh vs Trang dong

### Trang web tinh: Lam san, giao truc tiep

**Trang web tinh** la "san pham hoan thien" -- trang da duoc chuan bi tren may chu, khi ban truy cap may chu gui truc tiep file HTML san.

### Trang web dong: Lam tai cho, khac moi lan

**Trang web dong** la trang "lam tai cho" khi ban truy cap -- may chu nhan yeu cau, tra cuu co so du lieu, tinh toan du lieu, roi tao HTML moi gui ban.

### So sanh

| | Trang tinh | Trang dong |
|---|---------|---------|
| **Cach tao** | Lam san, luu tren may chu | Lam tai cho khi truy cap |
| **Toc do** | Nhanh | Cham (can tinh toan) |
| **Thay doi noi dung** | Kho (phai tao lai file) | De (thay doi tu backend) |
| **Vi du** | Trang cong ty, tai lieu | Taobao, WeChat, ngan hang truc tuyen |

---

## 6. Tom tat: Mot chuyen "mua sam truc tuyen" hoan chinh

| Giai doan | Thuat ngu ky thuat | Vi du mua sam | Nhiem vu cot loi | Cong nghe cot loi |
| ----------- | ---------- | -------- | ------------------ | ------------------------------ |
| **1. Phan tich** | Phan tich URL | Dien don hang | Hieu nguoi mua muon gi | Giao thuc, mien, cong, duong dan |
| **2. Truy van** | Truy van DNS | Tim dia chi kho | Tim kho hang gui | Truy van de quy/lap, bo nho dem |
| **3. Ket noi** | Bat tay TCP | Thiet lap kenh | Dam bao van chuyen | Bat tay ba lan, dieu khien luu luong |
| **4. Doi chuyen** | HTTP | Kho gui hang | Gui don va nhan hang | Phuong thuc, ma trang thai |
| **5. Trinh bay** | Render | Mo goi va lap rap | Trinh bay san pham | DOM, CSSOM, cay render, layout |

**Toan bo qua trinh hoan thanh trong vai tram mili-giay** -- hay nghi xem dieu nay ky lao den muc nao!

---

## 7. Bang thuat ngu

| Thuat ngu | Y nghia |
| ----------- | ----------------------------- |
| **URL** | Bo dinh vi tai nguyen thong nhat. "Dia chi" cua trang web |
| **DNS** | He thong ten mien. "Danh ba dien thoai" cua Internet |
| **IP** | Dia chi giao thuc Internet. "So nha" duy nhat cua moi thiet bi |
| **TCP** | Giao thuc dieu khien truyen. Dam bao truyen du lieu tin cay |
| **HTTP** | Giao thuc truyen sieu van ban. "Quy tac noi chuyen" giua trinh duyet va may chu |
| **HTTPS** | HTTP bao mat. HTTP voi ma hoa bo sung |
| **HTML** | Ngon ngu danh dau sieu van ban. "Khung xuong" cua trang web |
| **CSS** | Bang tinh theo phong cach. "Lop da" cua trang web |
| **DOM** | Mo hinh doi tuong tai lieu. Cau truc cay cua HTML |
| **Render** | Qua trinh chuyen code thanh pixel tren man hinh |

---

::: tip Chuc mung
Bay gio khi ban nhap URL vao thanh dia chi va nhan Enter, ban da co the thay the gioi so phia sau man hinh cua minh.

Ban da hieu:
- Tai sao doi khi trang web khong mo duoc (loi DNS, may chu ngung hoat dong)
- Tai sao mot so trang nhanh, mot so cham (do tre mang, hieu suat may chu, do phuc tap trang)
- Cach trinh duyet bien code thanh hinh anh (day chuyen render)
:::
