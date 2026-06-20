# Ban do Ngon ngu Lap trinh

::: tip Loi noi dau
Tai sao co nhieu ngon ngu lap trinh nhu vay? Nen hoc cai nao? Chuong nay se dan ban tu "su tien hoa cua ngon ngu" den "cac hinh thuc lap trinh" den "cach lua chon", xay dung hieu bieu toan canh ve ngon ngu lap trinh. **Ket luan truoc: Khong co ngon ngu tot nhat, chi co ngon ngu phu hop voi tung tinh huong.**
:::

**Bai viet nay se giup ban hoc gi?**

Sau khi hoc xong chuong nay, ban se co duoc:

- **Kha nang lua chon ly tri**: khi doi mat voi "hoc ngon ngu nao", co the phan doan dua tren nhu cau du an thay vi follow blind
- **Hieu sau ve hinh thuc**: hieu "huong doi tuong" va "lap trinh ham" la cach tu duy khac nhau
- **Goc nhin lich su**: nhin 70 nam tien hoa -- tu viet 0 va 1 den ma phat sinh bang ngon ngu tu nhien
- **Nen tang cho viec hoc sau**

| Chuong | Noi dung | Khai niem cot loi |
|-----|------|---------|
| **Chuong 1** | Tien hoa ngon ngu | Tu ngon ngu may den ngon ngu cap cao |
| **Chuong 2** | Hinh thuc lap trinh | Menh lenh, huong doi tuong, ham |
| **Chuong 3** | Lua chon ngon ngu | Phuong phap lua chon dua tren tinh huong |

---

## 0. Con nguoi "noi chuyen" voi may tinh nhu the nao?

Tuong tuong ban can giao tiep voi robot chi hieu nhi phan:

- **Ghi truc tiep 0 va 1** --Nguyen thuy nhat, hieu suat cuc thap (ngon ngu may)
- **Dung ky hieu giup nho** -- `MOV AX, 1` de nhan hon `10110000 00000001` (ngon ngu assembly)
- **Dung ngon ngu gan tu nhien** -- `int sum = 1 + 2;` con nguoi doc hieu ngay (ngon ngu cap cao)

**Ngon ngu lap trinh la cau noi giua con nguoi va may tinh**, tien hoa hon 70 nam theo huong "gan voi tu duy con nguoi hon".

---

## 1. Tien hoa cua ngon ngu lap trinh

Kham pha qua trinh tien hoa tu nhung nam 1940 den nay:

<LanguageMapDemo />

::: tip Tom tat mot cau
Xu huong tien hoa: **Cang gan tu duy con nguoi, cang an toan, cang hieu qua**.
:::

---

## 2. Hinh thuc lap trinh: Cach tu duy ve van de

Hinh thuc lap trinh khong phai la tinh nang ngon ngu, ma la **cach tu duy** -- nhu viet co tho, tieu thuyet, luan van khac nhau.

### 2.1 Menh lenh -- "Chi cho may tinh tung buoc lam"

```c
int sum = 0;
for (int i = 0; i < n; i++) {
    sum += arr[i];
}
```

### 2.2 Huong doi tuong -- "Dong goi du lieu va hanh vi thanh doi tuong"

```python
class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        print(f"{self.name} says woof!")
```

### 2.3 Ham -- "Dung ham nguyen thuc ket hop, khong thay doi trang thai"

```haskell
sum = foldl (+) 0
-- Cung dau vao luon cho cung dau ra
```

### 2.4 Khai bao -- "Chi noi lam gi, khong quan tam lam nhu the nao"

```sql
SELECT name FROM users WHERE active = true
-- Co so du lieu tu quyet dinh cach tim nhanh nhat
```

::: tip Trong phat trien thuc te
Ngon ngu hien dai da so la **da hinh thuc**. Python ho tro ca huong doi tuong va ham; JavaScript cung vay. Dung can nhac "hinh thuc nao tot nhat", ma chon phu hop voi van de.
:::

---

## 3. He thong kieu: Quy tac giao thong cua du lieu

| | Kieu manh | Kieu yeu |
|---|---|---|
| **Tinh** | Java, Rust, TypeScript -- An toan nhat | C, C++ -- Hieu qua nhung can than |
| **Dong** | Python, Ruby -- Linh hoat va an toan | JavaScript, PHP -- Linh hoat nhung de loi |

**Cau hoi cot loi**: `"1" + 1` bang bao nhieu?
- **JavaScript (yeu)**: `"11"` -- Tu doi cho ban
- **Python (manh)**: `TypeError` -- Bat ban tu nghi

Tim hieu sau ve he thong kieu -> [Nhap mon He thong Kieu](./type-systems) | [Nhap mon Bien dich](./compilers)

---

## 4. Bien dich vs Thong dich

| | Bien dich | Thong dich | JIT |
|---|---|---|---|
| **Qua trinh** | Dich tat ca truoc, roi chay | Doc va chay tung dong | Thong dich truoc, dich ma nong sau |
| **Toc do** | Nhanh nhat | Cham hon | Trung binh |
| **Debug** | Can cho bien dich | Phan hoi ngay lap tuc | Ngay lap tuc + toi uu |
| **Dai dien** | C, Rust, Go | Python, Ruby | Java, JavaScript |

---

## 5. Cach chon ngon ngu lap trinh?

### Chon theo tinh huong

| Tinh huong | Ngon ngu khuyen nghi | Ly do |
|---|---|---|
| **Frontend Web** | JavaScript, TypeScript | Trinh duyet chi hieu JS |
| **Backend Web** | Go, Java, Python, Node.js | He sinh thai truong thanh |
| **Phat trien mobile** | Swift (iOS), Kotlin (Android) | Khuyen nghi chinh thuc |
| **AI / Du lieu** | Python | PyTorch, Pandas deu o Python |
| **Lap trinh he thong** | C, Rust | Dieu khien truc tiep phan cung |
| **Cloud native** | Go, Rust | Docker/K8s viet bang Go |

### Lo trinh hoc tap

1. **Python** -- Cu phap don gian nhat, cong vao thoi dai AI
2. **JavaScript** -- Can thiet cho Web, ca frontend va backend
3. **TypeScript** -- Them he thong kieu cho JS
4. **Go hoac Rust** -- Hieu ngon ngu bien dich va khai niem cap thap

---

## 6. Tom tat

::: tip Diem cot loi
1. **Tien hoa ngon ngu**: tu ngon ngu may den ngon ngu cap cao, cang gan tu duy con nguoi
2. **Hinh thuc lap trinh**: menh lenh, huong doi tuong, ham, khai bao -- moi thu phu hop moi tinh huong
3. **He thong kieu**: tinh/dong, manh/yeu -- anh huong an toan va linh hoat
4. **Cach thuc thi**: bien dich nhanh, thong dich linh hoat, JIT can bang
5. **Khong co vien dan bac**: chon theo tinh huong, khong tim "ngon ngu tot nhat"
:::

**Buoc hoc tiep theo**:
- [Nhap mon Bien dich](./compilers) - Hieu qua trinh bien dich
- [Nhap mon He thong Kieu](./type-systems) - Hieu an toan kieu
- [Cau truc Du lieu](./data-structures) - Hieu to chuc du lieu
- [Tu duy Thuat toan](./algorithm-thinking) - Hoc phuong phap giai quyet
