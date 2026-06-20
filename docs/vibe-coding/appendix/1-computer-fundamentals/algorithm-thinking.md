# Nhap mon Tu duy Thuat toan

::: tip Loi noi dau
**Lam the nao de giai quyet van de mot cach hieu qua?** Ban co the da gap qua su hoang mang nay: cung mot van de, ma cua nguoi nay chay vai giay da co ket qua, con cua nguoi khac chay vai phut van dang xoay. Su khac biet thuong nam o thuat toan. Chuong nay se huong dan ban hieu tu duy cot loi cua thuat toan.
:::

**Bai viet nay se giup ban hoc gi?**

Sau khi hoc xong chuong nay, ban se co duoc:

- **Kha nang phan tich van de**: doi mat voi van de phuc tap, co the nghi den cac chien luoc nhu chia de tri, de quy, thay vi viet code ngay lap tuc
- **Kha nang danh gia hieu qua**: su dung ky hieu Big-O de xac dinh giua hai giai phap cai nao hieu qua hon, thay vi doan bang truc giac
- **Tu duy ve do phuc tap**: uoc tinh quy mo du lieu va yeu cau thoi gian truoc khi viet code, chon cap do thuat toan phu hop
- **Nen tang cho viec hoc sau**: dat nen tang cho cau truc du lieu nang cao, he thong phan tan, va hoc may

| Chuong | Noi dung | Khai niem cot loi |
|-----|------|---------|
| **Chuong 1** | Tim kiem nhi phan | Chia de tri, O(log n) |
| **Chuong 2** | Thuat toan sap xep | Noi bot, QuickSort, MergeSort |
| **Chuong 3** | Phan tich do phuc tap | Do phuc tap thoi gian, do phuc tap khong gian |

---

## 0. Toan canh: Thuat toan la gi?

Tuong tuong ban can tim mot tu trong tu dien:

- **Phuong phap 1**: bat dau tu trang dau tien, lat tung trang (tim kiem tuyen tinh)
- **Phuong phap 2**: dinh vi theo chu cai dau tien, roi tim kiem nhi phan (tim kiem nhi phan)

Ca hai phuong phap deu tim duoc, nhung hieu qua khac biet rat lon. **Thuat toan la phuong phap de giai quyet van de**.

<AlgorithmDemo />

**Cac chi so cot loi cua thuat toan:**

| Chi so | Y nghia | Vi sao quan trong |
|------|------|-----------|
| **Do phuc tap thoi gian** | Xu huong thoi gian chay khi du lieu tang | Du doan hieu suat voi du lieu quy mo lon |
| **Do phuc tap khong gian** | Xu huong su dung bo nho khi du lieu tang | Danh gia muc tieu thu bo nho |
| **Tinh dung dan** | Co luon luon cho ket qua dung | Yeu cau co ban cua thuat toan |

::: tip Doc tung dong trong bang nay
**Do phuc tap thoi gian**: duoc mo ta bang ky hieu Big-O. O(n) co nghia la du lieu gap doi, thoi gian gap doi; O(n^2) co nghia la du lieu gap doi, thoi gian tang 4 lan.

**Do phuc tap khong gian**: cung su dung ky hieu Big-O. Mot so thuat toan dung khong gian doi lay thoi gian (nhu bang bam), mot so dung thoi gian doi lay khong gian (nhu thuat toan nen).

**Tinh dung dan**: thuat toan phai cho ket qua dung cho moi dau vao co the. Cac dieu kien bien (dau vao rong, dau vao cuc lon) de gap loi nhat.
:::

---

## 1. Tim kiem nhi phan: loai bo mot nua moi lan

### 1.1 Nguyen ly cua tim kiem nhi phan

::: tip Tim kiem nhi phan hoat dong nhu the nao?
**Dieu kien tien quyet**: du lieu phai duoc sap xep

**Qua trinh**:
1. Tim phan tu o giua
2. Neu phan tu giua bang muc tieu, da tim thay!
3. Neu muc tieu nho hon phan tu giua, tiep tuc o nua ben trai
4. Neu muc tieu lon hon phan tu giua, tiep tuc o nua ben phai
5. Moi lan loai bo mot nua, cho den khi tim thay hoac xac dinh khong ton tai

**Do phuc tap thoi gian**: O(log n)

**Vi du cuoc song**: tro choi doan so. Nghi mot so tu 1 den 100, moi lan doan so o giua, toi se noi lon hon hay nho hon. Toi da 7 lan doan la co the doan dung (vi 2^7 = 128 > 100).
:::

Thu tay ngay duoi day:
Bai demo nay cho thay cach tim kiem nhi phan hoat dong, ban co the chon tim kiem tuan tu hoac nhi phan de so sanh:

<SearchAlgorithmDemo />

### 1.2 Vi sao tim kiem nhi phan nhanh nhu vay?

| Luong du lieu | Tim kiem tuyen tinh | Tim kiem nhi phan |
|--------|---------|---------|
| 100 | 100 lan | 7 lan |
| 1,000 | 1,000 lan | 10 lan |
| 1,000,000 | 1,000,000 lan | 20 lan |
| 1,000,000,000 | 1,000,000,000 lan | 30 lan |

::: tip Doc tung dong trong bang nay
**Cot dau tien (luong du lieu)**: co bao nhieu du lieu can tim. Co the thay luong du lieu tang tu 100 len 1 ty (tang 10 trieu lan!)

**Cot thu hai (tim kiem tuyen tinh)**: phuong phap "ngu" nhat, bat dau tu so dau tien va tim tung mot. So lan tim bang voi luong du lieu, du lieu cang nhieu, lan tim cang nhieu.

**Cot thu ba (tim kiem nhi phan)**: phuong phap thong minh, moi lan loai bo mot nua. So lan tim chi lien quan den logarit cua luong du lieu, ngay ca 1 ty du lieu chi can 30 lan!

**Ket luan so sanh**: khi luong du lieu dat 1 trieu, tim kiem tuyen tinh can 1 trieu lan, tim kiem nhi phan chi can 20 lan -- chenh lech dat 50,000 lan!
:::

::: tip Suc manh cua su tang truong logarit
Do phuc tap thoi gian cua tim kiem nhi phan la O(log n), dieu nay co nghia:

- 1 ty du lieu, toi da 30 lan tim
- 1 nghin ty du lieu, toi da 40 lan tim

Day la suc manh cua su tang truong logarit -- du lieu tang 1000 lan, so lan tim chi tang 10.
:::

---

## 2. Sap xep: bien doi tu vo trang tu co trang tu

### 2.1 Cac thuat toan sap xep thong dung

| Thuat toan | Do phuc tap thoi gian | Dac diem | Truong hop su dung |
|------|-----------|------|---------|
| **Sap xep noi bot** | O(n^2) | Don gian nhung cham | Giang day, du lieu nho |
| **Sap xep chon** | O(n^2) | Don gian nhung cham | Du lieu nho |
| **Sap xep chen** | O(n^2) | Nhanh voi du lieu gan nhu sap xep | Du lieu nho, gan nhu sap xep |
| **Sap xep nhanh (QuickSort)** | O(n log n) | Nhanh nhat trong thuc te | Sap xep tong quat |
| **Sap xep tron (MergeSort)** | O(n log n) | Sap xep on dinh | Truong hop can tinh on dinh |
| **Sap xep vung dong (HeapSort)** | O(n log n) | Sap xep tai cho | Truong hop bo nho han che |

::: tip Doc tung dong trong bang nay
**Sap xep noi bot**: thuat toan sap xep co ban nhat, nhu bong khi noi tu day nuoc len tren. Don gian de hieu, nhung cham nhat. Phu hop de hoc tu duy sap xep, khong phu hop de su dung thuc te.

**Sap xep chon**: moi lan chon so nho nhat de dat truoc. Cung don gian, nhung du du lieu co sap xep hay khong deu phai lam so phep so sanh nhu nhau.

**Sap xep chen**: nhu sap xep bai tren tay khi choi bai. Chen moi phan tu vao phan da duoc sap xep. Rat hieu qua voi du lieu gan nhu sap xep.

**Sap xep nhanh (QuickSort)**: thuong duoc su dung nhieu nhat trong phat trien thuc te. Nhanh nhat trong truong hop trung binh, nhung trong truong hop xau nhat (du lieu da sap xep) se suy thoai ve O(n^2).

**Sap xep tron (MergeSort)**: ap dung tu duy "chia de tri", luon luon O(n log n), nhung can khong gian bo sung. Phu hop cho truong hop can sap xep on dinh.

**Sap xep vung dong (HeapSort)**: su dung cau truc du lieu vung dong de sap xep tai cho (khong can khong gian bo sung), nhung trong thuc te thuong cham hon QuickSort.
:::

### 2.2 Vi sao QuickSort "nhanh"?

::: tip Nguyen ly cua QuickSort
**Tu duy cot loi**: chia de tri

1. Chon mot phan tu "chot"
2. Dat nhung so nho hon chot ben trai, lon hon ben phai
3. Sap xep de quy ca hai phan
4. Gop ket qua

**Vi sao nhanh?**
- Sau moi lan chia, phan tu chot da o vi tri cuoi cung
- Trung binh, moi lan chia loai bo khoang mot nua phan tu
- Do phuc tap thoi gian O(n log n)

**Vi du cuoc song**: sap xep ke sach. Rut ra mot cuon sach, dat nhung cuon mohng ben trai, nhung cuon day ben phai. Roi lap lai qua trinh nay voi tung phan.
:::

Thu tay ngay duoi day:
Bai demo nay hien thi truc quan hoa cua thuat toan sap xep, ban co the tao mang va quan sat so sanh giua sap xep noi bot va QuickSort:

<SortingAlgorithmDemo />

---

## 3. De quy: goi chinh minh

### 3.1 Ban chat cua de quy

::: tip De quy la gi?
**De quy** la ky thuat lap trinh ma ham goi chinh no.

**Hai yeu to cot loi**:
1. **Truong hop co ban**: khi nao de quy dung lai?
2. **Buoc de quy**: lam the nao de phan tich van de thanh cac van de con nho hon?

**Vi du kinh dien: giai thua**
```js
function factorial(n) {
  if (n <= 1) return 1        // Truong hop co ban
  return n * factorial(n - 1) // Buoc de quy
}
```

**Vi du cuoc song**: bup be Nga. Mo mot bup be, ben trong la bup be nho hon, cho den bup be nho nhat khong the mo duoc nua.
:::

### 3.2 De quy vs Lap

| Dac diem | De quy | Lap (vong lap) |
|------|------|-------------|
| **Do ngan gon cua code** | Thuong ngan gon hon | Co the phuc tap hon |
| **Tieu thu bo nho** | Cao hon (ngan xep loi goi) | Thap hon |
| **Hieu suat** | Cham hon mot chut (chi phi loi goi) | Nhanh hon |
| **Truong hop su dung** | Duyet cay, chia de tri | nhiem vu lap don gian |

::: tip Doc tung dong trong bang nay
**Do ngan gon cua code**: de quy thuong chi can vai dong code de bieu dien logic phuc tap (nhu duyet cay), trong khi dung vong lap co the can nhieu bien va long nhau hon.

**Tieu thu bo nho**: de quy su dung "ngan xep loi goi" de luu tru thong tin moi cap, nhu xep chen dia; moi cap de quy them mot dia. Vong lap khong can chi phi nay.

**Hieu suat**: moi lan goi ham deu co chi phi (truyen tham so, thao tac ngan xep, v.v.), nen de quy thuong cham hon vong lap.

**Truong hop su dung**: de quy tot cho cac van de co cau truc de quy (nhu cay tep, cay DOM); vong lap tot cho cac thao tac lap don gian (nhu duyet mang).
:::

::: warning Bay de quy
**Tran ngan xep**: de quy qua sau, khong gian ngan xep loi goi bi can ket.

**Giai phap**:
- Chuyen sang lap
- Su dung toi uu de quy duoi (mot so ngon ngu ho tro)
- Han che do sau de quy
:::

Thu tay ngay duoi day:
Bai demo nay cho thay qua trinh loi goi de quy, quan sat cach ham goi chinh minh:

<RecursiveThinkingDemo />

---

## 4. Thuat toan tham lam (Greedy): chon toi uu moi buoc

### 4.1 Tu duy cua thuat toan tham lam

::: tip Thuat toan tham lam la gi?
**Thuat toan tham lam** chon lua moi buoc phuong an toi uu hien tai, hy vong dat duoc loi giai toi uu toan cuc.

**Dieu kien ap dung**:
1. **Tinh chon tham lam**: toi uu cuc bo co the dan toi toi uu toan cuc
2. **Cau truc toi uu con**: loi giai toi uu cua van de chua loi giai toi uu cua van de con

**Vi du kinh dien: doi tien xu**
- Muc tieu: dung it xu nhat de tao thanh so tien chi dinh
- Chien luoc tham lam: moi lan chon xu co gia tri lon nhat
- Ket qua: 67 = 50 + 10 + 5 + 1 + 1 (5 xu)

**Vi du cuoc song**: khi leo nui, moi lan ban chon duong doc nhat de di len. Mac dau khong chac chan den dinh cao nhat, nhung thuong den mot vi tri tot.
:::

### 4.2 Han che cua thuat toan tham lam

::: warning Thuat toan tham lam khong luon dat duoc loi giai toi uu
**Vi du phan bien: doi tien xu**

Neu menh gia la [1, 3, 4] va can tao thanh 6:
- Tham lam: 4 + 1 + 1 = 3 xu
- Toi uu: 3 + 3 = 2 xu

Thuat toan tham lam that bai o day!

**Bai hoc**: thuat toan tham lam don gian va hieu qua, nhung khong luon dat duoc loi giai toi uu. Truoc khi su dung, can chung minh rang van de thoa man dieu kien tham lam.
:::

Thu tay ngay duoi day:
Bai demo nay cho thay hieu qua thuc te cua thuat toan tham lam, ban co the thu cac to hop xu khac nhau va quan sat hieu suat cua chien luoc tham lam:

<GreedyThinkingDemo />

---

## 5. Mo hinh thiet ke thuat toan

| Mo hinh | Tu duy | Thuat toan tieu bieu | Van de ap dung |
|------|------|---------|---------|
| **Chia de tri** | Phan tich van de thanh van de con | QuickSort, MergeSort | Van de co the phan tich |
| **Tham lam** | Chon toi uu moi buoc | Cay bao trum nho nhat, ma Huffman | Van de co tinh chat tham lam |
| **Quy hoach dong** | Ghi lai loi giai van de con | Bai toan cai tui, duong ngan nhat | Van de con chong cheo |
| **Quay lui** | Thu va quay lai neu khong duoc | Tam hau, hoan vi | Van de tim kiem |

::: tip Doc tung dong trong bang nay
**Chia de tri**: chia van de lon thanh van de nho, giai quyet tung phan roi gop lai. Nhu don dep nha, chia thanh phong khach, phong ngu, bep, don tung noi roi cuoi cung tat ca deu sach se.

**Tham lam**: moi lan chon tot nhat hien tai, khong quan tam den hau qua lau dai. Nhu khi an, chon mon yeu thich truoc; co the khong phai cach an toi uu, nhung nhanh.

**Quy hoach dong**: ghi nho ket qua trung gian de tranh tinh toan lai. Nhu ghi chu: lan sau gap cung van de, tim dap an truc tiep, khong can suy ra lai.

**Quay lui**: neu khong duoc thi quay lai thu lai. Nhu di trong me cung: duong nay khong duoc thi quay ve ngã tu truoc thu duong khac.
:::

Thu tay ngay duoi day:
Bai demo nay cho thay dac diem va truong hop ap dung cua cac mo hinh thiet ke thuat toan khac nhau:

<AlgorithmParadigmDemo />

---

## 6. Tom tat: Thuat toan la nghe thuat giai quyet van de

Hay dung mot vi du de tom tat cac tu duy thuat toan:

| Tu duy | Vi du | Diem cot loi |
|------|------|---------|
| **Tim kiem nhi phan** | Doan so | Loai bo mot nha moi lan |
| **Sap xep** | Sap xep ke sach | Thiet lap trat tu |
| **De quy** | Bup be Nga | Giam nho tu lon |
| **Tham lam** | Chon duong leo nui | Toi uu cuc bo |

::: tip Su tiet lo cot loi
**Ban chat cua thuat toan la su can bang giua "hieu qua" va "tinh dung dan".**

- Thuat toan tot co the cai thien hieu suat chuong trinh nhieu cap so mu
- Nhung toi uu qua muc co the gay phuc tap
- Dam bao dung dan truoc, roi moi theo doi hieu qua

Hieu tu duy thuat toan quan trong hon ghi nho thuat toan cu the:
- Chia de tri: phan tich van de lon thanh van de nho
- Tham lam: chon toi uu moi buoc
- Quy hoach dong: ghi lai loi giai van de con
- Quay lui: thu va quay lai neu khong duoc
:::

---

## Doc them

- **Introduction to Algorithms**: sach giao trinh kinh dien de hoc thuat toan he thong
- **LeetCode**: nang cao kha nang thuat toan thong qua luyen tap
- **Truc quan hoa thuat toan**: hieu qua trinh thuc thi thuat toan mot cach truc quan
- **Thuat toan cuoc thi**: hoc cac ky thuat thuat toan nang cao hon
