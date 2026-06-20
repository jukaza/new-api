# Cau truc Du lieu

::: tip Loi noi dau
**Chuong trinh = Cau truc Du lieu + Thuat toan.** Chung ta da hoc CPU thuc thi lenh nhu the nao, he dieu hanh quan ly tai nguyen ra sao. Nhung doi tuong cot loi ma chuong trinh xu ly la **du lieu** -- thong tin nguoi dung, danh sach san pham, quan he xa hoi... Cach to chuc du lieu nay trong bo nho quyet dinh truc tiep toc do chuong trinh. Cau tra loi thuong nam o **lua chon cau truc du lieu**.
:::

**Bai viet nay se giup ban hoc gi?**

- **Truc giac**: nhin yeu cau tu dong nghi den cau truc du lieu phu hop
- **Goc nhin hieu suat**: chan doan loi thuong la cau truc hay thuat toan
- **Tu duy thoa hiep**: hieu "khong gian doi thoi gian" va "thoi gian doi khong gian"
- **Doc code**: HashMap, Stack, Queue khong con xa la

| Chuong | Noi dung | Khai niem cot loi |
|-----|------|---------|
| **Chuong 1** | Toan canh | Bon loai cau truc du lieu |
| **Chuong 2** | Cau truc tuyen tinh | Mang, danh sach lien ket, ngan xep, hang doi |
| **Chuong 3** | Bang bam | Ham bam, xu ly dung do, tim kiem O(1) |
| **Chuong 4** | Cau truc cay | Cay nhi phan, cay tep, DOM |
| **Chuong 5** | Cau truc do thi | Do thi co huong, vo huong, duyet |
| **Chuong 6** | So sanh hieu suat | Do phuc tap thoi gian va khong gian |
| **Chuong 7** | Huong dan lua chon | Phan tinh huong |

---

## 1. Toan canh: Cau truc du lieu la gi?

Tuong tuong ban sap xep mot dong sach:

- **De tat ca lac san nha**: tim sach phai mo tung cuon -- luu tru nguyen thuy
- **Xep theo so tren ke**: di thang den vi tri -- **mang**
- **Phan loai vao tu**: xac dinh tu truoc -- **bang bam**
- **Sap xep tren ke nhieu tang**: loai bo mot nua moi lan -- **cay**

**Cau truc du lieu la "cach to chuc" du lieu** -- quyet dinh cach luu, tim, sua.

<DataStructureOverviewDemo />

---

## 2. Cau truc tuyen tinh

<LinearStructuresDemo />

### 2.1 Mang vs Danh sach lien ket

| Chieu | Mang | Danh sach lien ket |
|---------|------|------|
| **Bo nho** | Lien tuc | Re rac, noi bang con tro |
| **Truy cap phan tu thu n** | Truc tiep, O(1) | Tu dau, O(n) |
| **Chen vao giua** | Doi phan tu sau, O(n) | Doi con tro, O(1) |
| **Kich thuoc** | Co dinh | Tang dong |

### 2.2 Ngan xep va Hang doi

| Cau truc | Quy tac | Vi du | Xuat hien o dau? |
|------|------|------|-----------------|
| **Ngan xep (Stack)** | LIFO | Dong dia | Ngan xep loi goi, quay lai trinh duyet |
| **Hang doi (Queue)** | FIFO | Xep hang mua ve | Hang doi nhiem vu, hang doi tin nhan |

---

## 3. Bang Bam: Tim kiem nhanh nhat

<HashTableDemo />

### 3.1 Nguyen ly

1. Ban cho mot **khoa** (vd: "apple")
2. **Ham bam** tinh ra so (vd: `hash("apple") = 3`)
3. Di thang den vi tri 3 -- khong can duyet

### 3.2 Dung do bam

Hai khoa co the cho cung chi so -- day la **dung do bam**.

| Giai phap | Nguyen ly |
|---------|------|
| **Dia chi chuoi** | Danh sach lien ket tai cung vi tri |
| **Dia chi mo** | Tim vi tri trong tiep theo |

---

## 4. Cau truc Cay

<TreeStructureDemo />

### 4.1 Cay tim kiem nhi phan

Quy tac: **nho hon ben trai, lon hon ben phai**. Tim kiem O(log n).

### 4.2 Cay can bang

| Loai | Chien luoc | Ung dung |
|------|---------|---------|
| **AVL** | Can bang nghiem ngat | Tim kiem thuong xuyen |
| **Do-Den** | Can bang tuong doi | Java TreeMap, Linux kernel |
| **B-tree** | Can bang da ngoa | Chi so co so du lieu |

---

## 5. Cau truc Do thi

<GraphStructureDemo />

| Loai | Dac diem | Vi du |
|------|------|------|
| **Vo huong** | A→B nhu B→A | Ban be WeChat |
| **Co huong** | A→B khac B→A | Follow Weibo |
| **Co trong so** | Canh co trong so | Duong giua cac thanh pho |

---

## 6. So sanh hieu suat

<DataStructureDemo />

| Cau truc | Truy cap | Tim kiem | Chen | Xoa |
|---------|------|------|------|------|
| **Mang** | O(1) | O(n) | O(n) | O(n) |
| **Danh sach** | O(n) | O(n) | O(1) | O(1) |
| **Ngan xep/Hang doi** | O(n) | O(n) | O(1) | O(1) |
| **Bang bam** | -- | O(1) | O(1) | O(1) |
| **Cay BST** | -- | O(log n) | O(log n) | O(log n) |

---

## 7. Huong dan lua chon

| Nhu cau | Cau truc | Ly do |
|---------|---------|---------|
| Truy cap theo vi tri | Mang | O(1) truy cap ngau nhien |
| Chen/xoa thuong xuyen | Danh sach | O(1) khong doi phan tu |
| LIFO (hoan tac, de quy) | Ngan xep | LIFO tu nhien |
| FIFO (hang doi nhiem vu) | Hang doi | FIFO tu nhien |
| Tim kiem nhanh theo khoa | Bang bam | O(1) trung binh |
| Du lieu co trang tu + tim nhanh | BST | O(log n) va co thu tu |
| Quan he nhieu-nhieu | Do thi | Bieu dien ket noi tuy y |

::: tip Quy tac thuc hanh
- **80% tinh huong**: mang va bang bam du dung
- **Can co trang tu**: nghi den cay
- **Quan he phuc tap**: nghi den do thi
- **Khong chac?** Dung don gian nhat truoc
:::

---

## Doc them

| Chu de | Tai nguyen |
|------|---------|
| Truc quan hoa | [VisuAlgo](https://visualgo.net/) |
| Sach nhap mon | "Grokking Algorithms" |
| Sau hon | "Data Structures and Algorithm Analysis" |
| Luyen tap | [LeetCode](https://leetcode.cn/) |

## Buoc tiep theo

- **[Tu duy Thuat toan](./algorithm-thinking.md)**: Hoc giai quyet van de bang thuat toan
- **[Ngon ngu Lap trinh](./programming-languages.md)**: Cac ngon ngu trien khai cau truc nay
