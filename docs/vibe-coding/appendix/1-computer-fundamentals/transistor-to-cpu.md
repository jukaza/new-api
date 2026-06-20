# Tu Transistor den CPU

::: tip Loi noi dau
**May tinh "tu duy" nhu the nao?** Ban co the biet CPU la "nao" cua may tinh, nhung nao nay thuc chat hoat dong ra sao? No tu kim loai va nhua lam sao thanh thiet bi thong minh co the thuc thi chuong trinh va xu ly du lieu? Chuong nay se dan ban tu transistor co ban nhat den khi hieu nguyen ly xay dung CPU.
:::

**Bai viet nay se giup ban hoc gi?**

- **Hieu thuat ngu**: "tan so CPU", "da nhan", "tap lenh" khong con la bi an
- **Goc nhin thuc thi code**: thay mot dong code di qua fetch, decode, execute, writeback
- **Tu duy lop truu tuong**: hieu moi lop phuc vu lop tren nhu the nao

| Chuong | Noi dung | Khai niem cot loi |
|-----|------|---------|
| **Chuong 1** | Transistor | Cong tac cua the gioi so |
| **Chuong 2** | Cong logic | Thuc hien vat ly cua logic Boolean |
| **Chuong 3** | Don vi chuc nang | Bo cong, thanh ghi, multiplexer |
| **Chuong 4** | Nhan CPU | Fetch, decode, execute, writeback |

---

## 0. Toan canh: Tu cat den tri tue

Kha nang "tu duy" cua may tinh hien dai xuat phat tu dieu rat don gian: **cong tac**.

Khi dong dien chay qua cong tac, bieu dien la "1"; khi khong chay, la "0". Neu co hang ty cong tac nhu vay, va co the lam **dau ra cua mot cong tac dieu khien cong tac khac**, co the xay dung mang logic cuc ky phuc tap.

Tu cat den tri tue, co bon cap:

::: tip Phan tich tung lop
- **Lop 1: Transistor (hang ty)** -- "Cong tac" co ban nhat. MOSFET: ap dien vao cong cho dong chay giua nguon va thot
- **Lop 2: Cong logic (hang ty)** -- Transistor ket noi thanh AND, OR, NOT, XOR -- toan Boolean tren mach dien
- **Lop 3: Don vi chuc nang (hang tram)** -- To hop cong logic: bo cong, multiplexer, thanh ghi
- **Lop 4: Nhan CPU (1-128 nhan)** -- Trung tam chi huy: fetch, decode, execute, writeback
:::

---

## 1. Transistor: Cong tac cua the gioi so

<TransistorDemo />

### 1.1 Transistor la gi?

**Transistor** la thiet bi ban dan co the truu tuong thanh "cong tac" hoan hao:
- **Nguon (Source)** va **Thot (Drain)**: nhu hai dau ong nuoc
- **Cong (Gate)**: van dieu khien dong chay

Dieu khien bang **dien ap** thay bang tay. Khi mot cong tac co the duoc dieu khien boi tin hieu dien cua cong tac khac, chung ta da vuot qua khoang cach tu "can thiep nhan cong" den "tinh toan tu dong".

### 1.2 Bieu dien 0 va 1 nhu the nao?

- **Dien ap cao (vd: 3.3V)** = logic **1**
- **Dien ap thap (gan 0V)** = logic **0**

### 1.3 Tien hoa so luong transistor

| Nam | Xu ly | Transistor | Quy trinh |
| ---- | ---------- | ------------ | ------- |
| 1971 | Intel 4004 | 2,300 | 10um |
| 1993 | Intel Pentium | 3.1M | 800nm |
| 2006 | Core 2 Duo | 291M | 65nm |
| 2020 | Apple M1 | 16B | 5nm |
| 2023 | Apple M3 Max | 92B | 3nm |

---

## 2. Cong logic: Tinh toan bang cong tac

<LogicGateDemo />

### 2.1 Cong co ban

- **AND**: Tat ca dau vao phai la 1 thi dau ra moi la 1
- **OR**: Chi can mot dau vao la 1, dau ra la 1
- **NOT**: Dao nguoc dau vao
- **XOR**: Dau ra la 1 khi hai dau vao khac nhau

### 2.2 Cong bang cong logic

Mot XOR (tinh tong) + mot AND (tinh nho) = **bo cong nua (Half Adder)**.

<HalfAdderDemo />

Bo cong nua chi nhan hai dau vao. De cong nhieu so can **bo cong day du (Full Adder)** nhan ba dau vao.

<FullAdderDemo />

Noi nhieu bo cong day du de cong nhieu bit:

<AdderChainDemo />

<CompleteAdderDemo />

---

## 3. Don vi chuc nang: To hop cong logic

| Module | Nhiem vu | Vi du |
| ------ | ------ | -------- |
| **Bo cong** | Dong co so hoc | Ban tinh khong met |
| **Multiplexer** | Dieu khien luong du lieu | Nganh duong sat |
| **Giai ma** | Dich lenh nhi phan | Giai ma mat |
| **Flip-Flop** | Ghi trang thai | Can bang giu vi tri |

<FunctionalUnitDemo />

### 3.1 Thanh ghi: Luu tru du lieu

<RegisterDemo />

Bo nho duoc tao bang **phan hoi**: dau ra quay lai dau vao, tao vong kin giu trang thai. Khi 32 hoac 64 flip-flop duoc xep hang duoi cung tin hieu dong ho, ta co **thanh ghi**.

<FlipFlopDemo />

---

## 4. Kien truc CPU: Tu don vi chuc nang den xu ly

### 4.1 Thanh phan chinh

- **ALU**: thuc hien phep toan
- **Ngan thanh ghi**: luu tru tam thoi sieu nhanh
- **Bus noi bo**: van chuyen du lieu giua cac module
- **Don vi dieu khien**: doc lenh, tao tin hieu dieu khien

<MinCpuDemo />

### 4.2 CPU thuc thi lenh nhu the nao?

1. **Fetch**: Doc lenh tu bo nho
2. **Decode**: Phan tich thuc hien phep toan gi
3. **Execute**: Thuc hien phep toan tai ALU
4. **Write Back**: Ghi ket qua vao thanh ghi hoac bo nho

<CpuArchitectureDemo />

::: tip Pipeline: Tim hieu suat toi da
Thay vi cho mot lenh hoan thanh 4 buoc roi moi bat dau lenh tiep, **pipeline** cho phep chong lenh: trong khi lenh A thuc thi, B giai ma va C lay ve.
:::

---

## 5. Tom tat: Qua cac lop truu tuong

1. **Vat ly macro**: Cat (silic dioxide)
2. **Vat ly micro**: Hang ty transistor
3. **Dai so so**: Cong logic AND/OR/NOT
4. **Module vi kien truc**: Don vi chuc nang
5. **Kien truc phuc tap**: CPU
6. **Ung dung**: Phan mem va Internet

::: tip suy nghi cuoi
**Cong suc tinh toan chi la hang ty cong tac sap xep lai trong khong gian kin; theo nhung nhip dong ho, hoan thanh tinh toan phuc tap tren manh silic nho nay.**

"Luong dan den chat luong" -- cau nay duoc chung minh lien tuc trong kien truc may tinh.
:::

---

## Doc them

- **Sach kinh dien**: "Computer Organization and Design" - Patterson & Hennessy
- **Mo phong logic so**: Xay dung bo cong 8 bit
- **Kien truc nang cao**: Cache da cap, thuc thi ngoai trinh tu, GPU
- **Ngon ngu assembly**: Hieu code cap cao thanh lenh may nhu the nao
