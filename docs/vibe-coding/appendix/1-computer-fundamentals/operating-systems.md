# He dieu hanh: Thue mot "Quan ly lon" cho may tinh

::: tip Loi noi dau
**Co CPU hoan hao va bo nho vo han, may tinh co the su dung ngay duoc khong?**
Trong chuong truoc, chung ta da chung kien transistor ket hop thanh CPU manh me nhu the nao. Nhung ngay ca khi ban co phan cung tot nhat, neu de chung lam viec truc tiep, chi de hien thi mot chu cai tren man hinh cung can viet hang tram dong lenh may tinh kho hieu. Khong chi phuc tap, con cuc ky nguy hiem -- chi can mot sai sot nho, code cua ban co the ghi de du lieu cua nguoi khac.

De giai quyet nhung con ac mong nay, **He dieu hanh (Operating System, OS)** ra doi. No la lop "phan mem" vi dai nhat giua ban va phan cung lanh leo. Chuong nay se bo qua code sau, dung vi du don gian de xem "siep quan ly" nay thu phuc phan cung loan nhu the nao.
:::

**Bai viet nay se giup ban hoc gi?**

Sau khi hoc xong chuong nay, ban se co duoc:

- **Kha nang phan tich van de**: khi gap "chuong trinh bi treo" hoac "khong du bo nho", co the phan tich nguyen nhan tu goc do he dieu hanh
- **Hieu sau ve thuat ngu**: hieu "da tien trinh", "bo nho ao", "quyen tep" giai quyet van de gi
- **Tu duy he thong**: hieu chuong trinh khong chay doc lap ma tuong tac chat che voi he dieu hanh, tien trinh khac va tai nguyen phan cung
- **Nen tang cho viec hoc sau**: dat nen tang cho lap trinh song song, dieu chinh he thong, cong nghe container

| Chuong | Noi dung | Khai niem cot loi |
|-----|------|---------|
| **Chuong 1** | Quan ly tien trinh | Da hoa thoi gian CPU, vong quay thoi gian |
| **Chuong 2** | Quan ly bo nho | Bo nho ao, co che phan trang |
| **Chuong 3** | He thong tep | To chuc tep, cau truc thu muc |

---

## 0. Toan canh: Se nhu the nao khong co he dieu hanh?

Tuong tuong ban mo mot "nha may tinh toan" tiem nang vuot troi (may tinh cua ban), voi mot nhan vat tot nhat khong bao gio met moi (CPU), mot kho lon (bo nho) va vo so container (o cung).

Neu ban **khong thue** mot giam doc (he dieu hanh):
1. **Khuynh hai doc quyen CPU**: CPU chi lam duoc mot viec luc mot. Neu ai dang dung nghe nhac, tat ca nhung nguoi muon duyet web? Xin loi, phai doi.
2. **Tai nan dam dap bo nho**: WeChat va game deu su dung kho (bo nho). Khong co bao ve, game co the de du lieu trang bi vao hop cua WeChat, gay crash ngay lap tuc.
3. **Me cung o cung**: Phan cung o cung chi la dia ghi day 0 va 1. De tim anh hom qua, ban phai nho chinh xac "mat 1, rong 56, section 8" -- khong ai nho duoc toa do phi nhan nhu vay.

<OSArchitectureDemo />

De giai quyet ba con ac mong tren, he dieu hanh dua ra ba vu khi chinh: **quan ly tien trinh**, **quan ly bo nho** va **he thong tep**.

---

## 1. Quan ly tien trinh: Da hoa thoi gian cua CPU

Ban thuong dung may tinh voi WeChat mo, nghe nhac, va go chu. Nhung neu may chi co mot nhan CPU, lam sao no lam ba viec nay cung luc?

Dap an: **No khong lam cung luc. Ma he dieu hanh dang "quan ly thoi gian" dien cu.**

<ProcessDemo />

### 1.1 "Tien trinh" la gi?
Moi chuong trinh dang chay duoc goi la mot **tien trinh**. Ban co the hieu nhu mot "nhom du an", voi code rieng (danh sach cong viec), du lieu bo nho rieng (von du an), doi gap CPU.

### 1.2 Vong quay thoi gian
De khong de phan mem ac quyen doc quyen CPU, he dieu hanh cat thoi gian CPU thanh manh rat nho (khoang 10 ms), phan phoi luon phien cho cac tien trinh. Vi chuyen doi qua nhanh, ban cam thay "chay cung luc".

---

## 2. Quan ly bo nho: Khong gian dia chi ao

Giai quyet van de chia CPU, tiep theo la khong gian bo nho. Khong co quan ly, tat ca phan mem ghi truc tiep vao bo nho vat ly, se xay ra **dam dap lan nhau**.

<MemoryDemo />

### 2.1 Bo nho ao (Virtual Memory)
He dieu hanh noi doi voi moi tien trinh: "Nay, ban doc quyen toan bo bo nho kha dung cua toan may, dung thoai mai!"

Trong mat tien trinh, bo nho cua minh luon **lien tuc** va **sach se**. No yen tam ghi du lieu vao do.

### 2.2 Bang trang (Page Table)
Thuc te? He dieu hanh偷偷 nhet du lieu vao **bo nho vat ly thuc** trong cac khe hong le tung. Dieu nay co hai loi ich tuyet voi:
1. **An toan tuyet doi**: WeChat chi thay khong gian cua minh, khong the sua du lieu cua nguoi khac
2. **Tiep thu manh**: du bo nho vat ly co roi, khong gian ao cho tien trinh van ngay ngan

---

## 3. He thong tep: To chuc luu tru lau dai

Neu ban mua mot o cung moi, no chi la vung luu trong hoang tat. Neu ban muon luu mot buc anh, o cung chi hoi: "Cho toi biet ban muon luu o byte thu may?"

<FilesystemDemo />

### 3.1 He thong tep lam gi?
1. **Cat o cung**: Chia o cung thanh vo so **khoi** co kich thuoc co dinh (thuong la 4KB)
2. **Tao so ke**: Ghi khoi nao day, khoi nao trong
3. **Dich duong dan**: Chuyen `D:/Anh/ThuCung.jpg` thanh "khoi 3, 7, 11"

Vi vay doi ten tep hoan thanh ngay lap tuc (chi doi ten trong so ke), con sao chep tep mat lau (phai doc ghi khoi du lieu thuc).

---

## 4. Phoi hop cua ba: Qua trinh khoi dong chuong trinh hoan chinh

Chung ta da hieu ba module chinh cua he dieu hanh. Hay xem chung phoi hop nhu the nao khi ban **nhan doi de mo mot chuong trinh**:

<ProgramLaunchDemo />

Du ban nhan icon tren man hinh hay viet `print("Hello World")` trong code, deu phu thuoc vao thao tac oc phuc tap nay. Vi chung ta co the lướt web de dang trong the gioi so la nho he dieu hanh lam viec kho thay duoi day.

---

## Doc them

Neu ban thay cac "ky thuat quan ly va lua doi" cua he dieu hanh rat thu vi, ban co the tim hieu cac chu de nang cao:
- **Tien trinh va tieu trinh**: Neu tien trinh la nhom du an, thi "tieu trinh" la nhan vien lam viec trong nhom
- **Song song va khoa**: Khi hai tien trinh cung tranh tai nguyen, cach ngan deadlock
- **Loi goi he thong**: "Cua so dich vu" he dieu hanh cung cap cho ung dung
