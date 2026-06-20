# Ma hoa va Truyen tai Du lieu la gi?

::: tip Loi noi dau
Khi ban gui mot buc anh cho ban, gui tin nhan WeChat, hoac tai mot game vai GB, nhung thong tin nay di qua nua trai dat va xuat hien nguyen ven tren man hinh cua ban nhu the nao? Chuong nay tap trung vao mot cau hoi thuong lam bối rối nguoi moi: **Tai sao tep ban nhan lai bi loi ma?** Tu cau hoi nay, chung ta se kham pha ba trong tam co ban nhat cua may tinh: **ma hoa, luu tru va truyen tai**.
:::

**Bai viet nay se giup ban hoc gi?**

Sau khi hoc xong chuong nay, ban se co duoc:

- **Kha nang phan tich loi ma**: khi gap "tep mo ra la ky tu la", co the phan tich nguyen nhan tu goc do ma hoa
- **Y thuc da nen tang**: biet tai sao can chu y den dinh dang ma hoa va thu tu byte khi trao doi du lieu
- **The gioi quan ma hoa**: hieu may tinh bieu dien moi thu bang 0 va 1 nhu the nao
- **Nen tang cho viec hoc sau**

| Chuong | Noi dung | Khai niem cot loi |
|-----|------|---------|
| **Chuong 1** | Ma hoa ky tu | ASCII, UTF-8, GBK |
| **Chuong 2** | Luu tru du lieu | Nhi phan, thu tu byte |
| **Chuong 3** | Truyen tai du lieu | Serialize, nen |

---

## 0. Mo dau: Tai sao tep lai thanh "van tu co"?

Tuong tuong ban nhan duoc mot tep quan trong tu dong nghiep, mo ra thay toan ky tu la nhu "浣犲ソ" hoac "ä½ å¥½".

Su that la: phan lon "tep hong" chi co mot nguyen nhan -- **may tinh "khong tim dung tu dien"**.

<GarbledTextDemo />

**Kien thuc cot loi: Tu dien khong khop**

Byte (chuoi 0 va 1) khong co y nghia tuyet doi, la **quy tac ma hoa** do con nguoi tao ra moi cho chung y nghia.

Nguoi gui dung tu dien UTF-8 de dich hanh tu Thanh so, ban neu dung tu dien GBK de doc nhung so nay, ket qua tat nhien la ma la.

---

## 1. Ma hoa du lieu la gi? (Bien moi thu thanh so)

**Ma hoa du lieu (Encoding)** la tao mot "tu dien hai chieu", anh xa thong tin the gioi thuc (van ban, mau sac, am thanh) thanh 0 va 1.

### 1.1 Tu van ban thanh so: Tu ASCII den Unicode

**Giai doan 1**: ASCII -- chi 128 ky tu, du cho tieng Anh.

**Giai doan 2**: Thoi ky phan tan -- moi quoc gia lam tu dien rieng (GBK, Shift_JIS...), gay hon loan.

**Giai doan 3**: Unicode thong nhat -- cap so duy nhat cho moi ky tu tren the gioi. UTF-8 la quy tac luu tru pho bien nhat: tieng Anh 1 byte, tieng Trung 3 byte.

<CharacterEncodingExplorer />

### 1.2 Mau va am thanh thanh so nhu the nao?

* **Ma hoa hinh anh**: Anh gom hang trieu pixel. Moi mau co ma so (nhu `#FF0000` la do).
<ImageEncodingDemo />

* **Ma hoa am thanh**: Am thanh la song. Do chieu cao song 44,100 lan/giay, ghi lai gia tri.
<AudioEncodingDemo />

---

## 2. Cau noi luu tru: Truoc khi gui, phai dat vao dau do

Sau khi ma hoa, truoc khi gui, phai luu vao phuong tien vat ly. Co mot luat sat: **luu tru cang nhanh, gia cang dat, dung luong cang nho.**

<StoragePyramidDemo />

He dieu hanh nhu mot quan ly kho thong minh: luu phim/game o o cung cham nhung lon, khi chay thi chuyen sang RAM nhanh nho, khi dong thi don RAM cho tep khac.

---

## 3. Truyen tai du lieu la gi? (Gui 0 va 1 di du lich)

### 3.1 Truyen tai phan cung va LAN

Trong thung may hoac giua cac may gan nhau, la **thach thuc vat ly**. Ngay nay USB Type-C, PCIe dung **truyen tai noi tiep** (mot kenh chinh).

<DataTransmissionDemo />

### 3.2 WAN va Internet

Khi du lieu phai di den may chu o nuoc khac, di qua cap quang bien, tram goi cu phan tan. Truoc mat la **thach thuc su phuc hoi**.

1. **Cat goi**: Mang cat video thanh hang nghin goi du lieu (~1500 byte)
2. **Kiem tra (Checksum)**: Tinh ma kiem tra truoc khi gui
3. **TCP gui lai**: Neu goi mat hoac hong, yeu cau gui lai

Nho co che **TCP** nay, ngay ca WiFi khong on dinh, tep tai ve luon nguyen ven 100%.

---

## 4. Thuc hanh cuoi: Tu chup anh den dang mang xa hoi

<PhotoUploadJourneyDemo />

---

## 5. Bang thuat ngu

| Thuat ngu | Giai thich |
| :--- | :--- |
| **Bit (b)** | Don vi nho nhat, chi co the la 0 hoac 1 |
| **Byte (B)** | 8 Bit gop lai. Don vi co ban do kich thuoc tep |
| **Character Set** | "Muc luc tu dien", dinh nghia ky tu nao ton tai |
| **Encoding** | "Quy tac luu tru", xac dinh ky tu ung voi byte nao |
| **RAM** | Bo nho lam viec nhanh nhung mat dien se xoa |
| **SSD** | O cung the thao, luu tru vinh viu nhanh |
| **Serial / Parallel** | Noi tiep = mot kenh xep hang; Song song = nhieu kenh cung luc |
| **Checksum** | Ma kiem tra kem theo du lieu truyen |
| **TCP** | Giao thuc dieu khien truyen, dam bao giao hang 100% nguyen ven |

---

## Tom tat

- **Tai sao cung tep nhan bi ma la?** Du lieu khong hong, chi la phan mem dung sai tu dien (van de ma hoa).
- **Tai sao day Type-C mong hon nhung nhanh hon?** Vi truoc la nhieu xe ngua chay song song (song song), gio la tau cao toc tren duong rieng (noi tiep).
- **Tai sao game lon tai lau?** Vi can chuyen hang chuc GB tu o cung cham sang RAM nhanh.

Ban chat may tinh rat don gian: **chuyen doi** (ma hoa), **luu tru** (giu), va **gui di** (truyen tai) moi thong tin thanh xung dien.
