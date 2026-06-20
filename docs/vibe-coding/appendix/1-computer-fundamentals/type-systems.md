# Nhap mon He thong Kieu

::: tip Loi noi dau
**Tai sao `"1" + 1` trong JavaScript cho `"11"`, nhung trong Python lai bao loi?** Phia sau la he thong kieu dang hoat dong. He thong kieu la "quy tac giao thong" cua ngon ngu -- no quyet dinh du lieu co the su dung nhu the nao, co the tinh toan voi ai, va khi nao kiem tra tinh hop phap. Hieu he thong kieu giup ban hieu "su khac biet ve tinh cach" giua cac ngon ngu.
:::

**Bai viet nay se giup ban hoc gi?**

Sau khi hoc xong chuong nay, ban se co duoc:

- **Kha nang phan loai**: lam chu phuong phap phan loai bon tu (tinh/dong, manh/yeu)
- **Chan doan van de**: khi thay `TypeError`, dinh vi nhanh la khong phu hop kieu hay chuyen doi an
- **Lua chon ngon ngu**: hieu tai sao TypeScript phu hop du an lon, Python phu hop nguyen mau nhanh
- **Sue dien kieu**: hieu ngon ngu hien dai can bang don gian va an toan nhu the nao
- **Y thuc thuc hanh**: lam chu thoi quen code an toan kieu

| Chuong | Noi dung | Khai niem cot loi |
|-----|------|---------|
| **Chuong 1** | He thong kieu la gi | Ban chat cua kieu, tai sao can kieu |
| **Chuong 2** | Tinh vs Dong | Thoi diem kiem tra, ho tro IDE, an toan |
| **Chuong 3** | Manh vs Yeu | Chuyen doi an, an toan kieu |
| **Chuong 4** | Sue dien kieu | Sue dien tu dong, tot ca hai |
| **Chuong 5** | Generic | Tham so kieu, rang buoc kieu, tai su dung |
| **Chuong 6** | An toan kieu thuc hanh | Bay thuong gap, chien luoc phong thu |
| **Chuong 7** | Tu doan kieu | Phan loai bon tu, lua chon ngon ngu |

---

## 0. Toan canh: Kieu la "CMND" cua du lieu

Trong doi thuc, ban khong nhay mot cuon sach vao coc ca phe -- vi chung la nhung "kieu" khac nhau. The gioi lap trinh cung vay: so, chuoi, boolean, mang... moi du lieu co "danh tinh" rieng, quyet dinh no co the tham gia phep toan nao.

**He thong kieu** la bo quy tac ma ngon ngu su dung de quan ly cac "danh tinh" nay. No tra loi hai cau hoi cot loi:

::: tip Hai cau hoi cot loi cua he thong kieu
- **Khi nao kiem tra?** Khi viet code (tinh) hay khi chay (dong)?
- **Nghiem ngat bao nhieu?** Cam hon hop (manh) hay tu dong chuyen doi (yeu)?
:::

---

## 1. He thong kieu la gi: Quy tac giao thong cua du lieu

<TypeSystemDemo />

Ban chat he thong kieu la mot bo **quy tac rang buoc**, bao trinh bien dich hoac thong dich:

- Bien nay co the luu gia tri gi?
- Hai gia tri nay co the cong duoc khong?
- Tham so cua ham nay nen la gi?

The gioi khong co he thong kieu nhu con duong khong co quy tac giao thong -- bat ky du lieu nao cung co the phep toan voi bat ky du lieu nao, ket qua hoan toan khong the doan truoc.

| Chuc nang cua he thong kieu | Giai thich | Vi du |
|-------------|------|------|
| Ngan phep toan khong hop le | Chan thao tac vo nghia | Khong the chia mot chuoi |
| Cung cap thong tin tai lieu | Kieu la tai lieu tot nhat | `function add(a: number, b: number)` ro rang |
| Ho tro cong cu IDE | Tu dong hoan thanh, cau truc lai | Gõ `user.` tu hien tat ca thuoc tinh |
| Toi uu hieu suat | Trinh bien dich tao code nhanh hon khi biet kieu | Biet la so nguyen dung lenh so nguyen |

---

## 2. Tinh vs Dong: Khi nao kiem tra?

Day la chieu phan loai quan trong nhat -- **thoi diem kiem tra**.

<StaticVsDynamicDemo />

::: tip Khac biet cot loi
- **Tinh**: kieu bien duoc xac dinh khi bien dich, viet xong code truoc khi chay da co the tim loi kieu. Dai dien: Java, TypeScript, Rust, Go.
- **Dong**: kieu bien duoc xac dinh khi chay, cung mot bien co the luu so roi luu chuoi. Dai dien: Python, JavaScript, Ruby, PHP.
:::

---

## 3. Manh vs Yeu: Co cho phep "chuyen doi an" khong?

<StrongVsWeakDemo />

::: tip Khac biet cot loi
- **Manh**: khong cho phep chuyen doi an, kieu khong khop thi bao loi. Ban phai noi ro "toi muon chuyen chuoi nay thanh so".
- **Yeu**: cho phep chuyen doi an, ngon ngu se "tot bu" chuyen ho ban. Nhung "long tot" nay thuong mang den bug bat ngo.
:::

---

## 4. Sue dien kieu: Tot ca hai

<TypeInferenceFlowDemo />

::: tip Gia tri cua sue dien kieu
Viet don gian nhu ngon ngu dong, trinh bien dich kiem tra nghiem nhu ngon ngu tinh. Day la huong chinh cua ngon ngu hien dai.
:::

---

## 5. Generic: Viet mot lan, dung cho moi kieu

<GenericTypeDemo />

::: tip Gia tri cot loi cua Generic
- **Tai su dung code**: mot ham/lop cho moi kieu
- **An toan kieu**: khac voi `any` tu bo kiem tra, generic giu thong tin kieu
- **Rang buoc kieu**: dung `extends` gioi han pham vi, linh hoat va an toan
:::

---

## 6. An toan kieu thuc hanh: Bay thuong gap va phong thu

<TypeSafetyPracticeDemo />

::: tip Bon quy tac vang cua an toan kieu
1. **Bat che do nghiem ngat**: `strict: true` trong TypeScript, `mypy --strict` trong Python
2. **Tranh any**: dung `unknown` thay `any`, buoc kiem tra truoc khi su dung
3. **Xu ly null ro rang**: dung optional chaining `?.` va nullish coalescing `??`
4. **Dinh nghia interface cho API**: du lieu ben ngoai khong bao gio tin duoc, dung interface + kiem tra luc chay
:::

---

## 7. Tu doan kieu: "Chan dung" ngon ngu

<LanguageTypeModelDemo />

| Tu doan | Dac diem | Ngon ngu dai dien | Truong hop su dung |
|------|------|---------|---------|
| Tinh + Manh | An toan nhat, kiem tra nghiem khi bien dich | Rust, Java, Haskell | He thong lon, an toan then chot |
| Tinh + Yeu | Kiem tra khi bien dich nhung cho chuyen doi an | C, C++ | Lap trinh he thong, hieu suat |
| Dong + Manh | Kiem tra luc chay, khong cho chuyen doi an | Python, Ruby | Script, nguyen mau nhanh |
| Dong + Yeu | Linh hoat nhat, cung de loi nhat | JavaScript, PHP | Frontend web, script nho |

---

## Tom tat

He thong kieu la goc nhin cot loi de hieu su khac biet giua cac ngon ngu. No khong phai ly thuyet kho han, ma anh huong truc tiep trai nghiem viet code va chat luong code.

Cac diem cot loi:

1. **Kieu la danh tinh**: moi du lieu co kieu, kieu quyet dinh co the tham gia gi
2. **Tinh vs Dong**: khi nao kiem tra kieu -- bien dich hay chay
3. **Manh vs Yeu**: co cho phep chuyen doi an khong
4. **Sue dien kieu**: ngon ngu hien dai cho ban don gian dong va an toan tinh
5. **Generic**: tai su dung code voi tham so kieu
6. **An toan thuc hanh**: null, any, chuyen doi an la bay thuong gap nhat
7. **Bon tu**: khong co he thong kieu tot nhat, chi co phu hop nhat

## Doc them

- [Tai lieu chinh thuc TypeScript](https://www.typescriptlang.org/docs/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)
- [Rust Book - Data Types](https://doc.rust-lang.org/book/ch03-02-data-types.html)
- [Type Systems (Wikipedia)](https://en.wikipedia.org/wiki/Type_system)
