---
title: 'Tim y tuong tot - tu nhu cau nguoi dung den san pham co nguoi tra tien'
description: 'Hoc cach phat hien co hoi tu nhung noi dau hang ngay, phan tich nhu cau co he thong, va mai dua mot y tuong binh thuong thanh khai niem san pham ma nguoi dung san sang tra tien.'
---

<script setup>
const duration = 'Khoang <strong>3 gio</strong>'
</script>

# So cap 2: Tim y tuong tot

## Dan nhap chuong

<ChapterIntroduction :duration="duration" :tags="['Khai pha nhu cau', 'Tu duy san pham', 'Phan tich nguoi dung', 'Mo hinh kinh doanh']" coreOutput="3 khai niem san pham da duoc kiem chung" expectedOutput="Huong san pham/co hoi khoi nghiep co the trien khai">

O chuong truoc, ban da thay AI IDE co the giup ta tao ra san pham rat nhanh. Nhung truoc khi viet dong code dau tien, co mot cau hoi can ban hon:

<strong>Minh se lam cai gi?</strong>

Rat nhieu nguoi bat dau bang "lam mot cong cu AI" hoac "lam mot mang xa hoi", nhung lam xong thi khong ai dung. Van de thuong nam o dau? <strong>Chua tim duoc nhu cau that.</strong>

Thuc te con kho hon: <strong>co san pham giai quyet dung van de nhung nguoi dung van khong muon tra tien</strong>.

Trong chuong nay, thong qua cau chuyen cua Minh, ban se hoc mot phuong phap hoan chinh de tim y tuong: tu tieu chuan danh gia, khai pha noi dau, phan nhom nguoi dung, dao sau boi canh, kiem chung nhu cau, va mai dua khai niem san pham.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Step 1', description: 'Xay tieu chuan danh gia' },
      { title: 'Step 2', description: 'Khai pha noi dau hang ngay' },
      { title: 'Step 3', description: 'Phan nhom nguoi dung theo chieu ngang' },
      { title: 'Step 4', description: 'Dao sau boi canh theo chieu doc' },
      { title: 'Step 5', description: 'Kiem chung nhu cau that/gia' },
      { title: 'Step 6', description: 'Mai dua khai niem san pham' }
    ]" />
  </ClientOnly>
</div>

## Step 1: Xay tieu chuan danh gia - nhu cau nao khien nguoi dung san sang tra tien

::: warning Vi sao chuong nay quan trong?

Co the ban se nghi: "Day la khoa hoc Vibe Coding, sao lai hoc tim nhu cau truoc? Khong viet code luon duoc a?"

Rat nhieu khoa hoc lap trinh bat dau bang du an: Todo List, may tinh, blog ca nhan... Nhung neu huong di sai, ban cang lam nhieu cang xa muc tieu.

Hay tuong tuong:

- Ban bo 2 tuan lam "he thong quan ly lich", trong khi thi truong da co hang tram san pham tot hon.
- Ban lam app "chup anh tinh calo", nhung nguoi dung dung 1 lan roi go.
- Ban lam "so chi tieu ca nhan", nhung chinh ban cung it dung.

Lam xong, ban co cam thay tu tin de coi do la "mot san pham dang gia" khong? Thuong la khong, vi no khong giai quyet van de that, khong tao gia tri that.

Vibe Coding lam cho viec bien y tuong thanh san pham nhanh hon. Chinh vi nhanh, ta can biet <strong>chuyen gi dang lam</strong>.

:::

### Tieu chuan danh gia y tuong (ban nen ghi ra)

Mot y tuong "dang lam" thuong can dat toi thieu 4 tieu chuan:

1. **Co nguoi gap van de thuong xuyen**: khong phai mot tinh huong hiem.
2. **Van de co gia tri**: tiet kiem thoi gian, tien bac, rui ro, hoac giam dau dau.
3. **Nguoi dung co dong luc hanh dong**: ho san sang thay doi hanh vi de giai quyet.
4. **Ban co cach tiep can**: ban biet tim nguoi dung o dau va co the lay phan hoi.

Neu y tuong chi "nghe hay" nhung khong ro ai can, can nhu the nao, va vi sao ho tra tien, thi rat de lam xong roi... khong ai dung.

## Mo dau: cau chuyen cua Minh

Minh la mot lap trinh vien da di lam 3 nam. Mot ngay, Minh nghi: "Hay lam mot app the hinh giup nguoi dung len ke hoach tap va ghi lai du lieu tap luyen." Minh rat hao hung vi cam thay minh tim duoc mot du an lon.

Mot nam tiep theo, Minh danh het thoi gian ranh de lam app: khoa hoc, check-in, cong dong, phan tich du lieu... giao dien cung dep (theo Minh thay).

Ngay ra mat, Minh chi tien quang ba. Thang dau co 50.000 luot tai. Nghe co ve tot.

Nhung van de den nhanh:

- Nguoi dung tai ve dung 1 lan roi go.
- Ty le quay lai sau 7 ngay rat thap.
- Tinh nang tra phi gan nhu khong ai mua.
- Thi truong da co san pham truong thanh voi noi dung va he sinh thai manh.

Minh lo nang va tu hoi: "Minh lam cung on ma, sao khong ai dung?"

Van de khong phai Minh thieu ky thuat. Van de nam o **diem xuat phat**: Minh chua lam ro cau hoi can ban nhat: <strong>nguoi dung co that su can them mot app nay khong, va vi sao ho se tra tien?</strong>

Tu do, ta rut ra bai hoc: <strong>huong di sai thi cang di sau cang sai</strong>.

::: tip Chuong nay ban se lam gi?

Ban se di qua 3 man:

1. Tim nhu cau that: nhu cau nao co gia tri va co the tra tien.
2. Dao ra y tuong tot: tu noi dau hang ngay tao thanh co hoi san pham.
3. Mai dua bang AI: dung AI de bien y tuong thanh phuong an co the trien khai va kiem chung.

:::

## Step 2: Khai pha noi dau hang ngay

Nguon y tuong on dinh nhat thuong den tu "noi dau hang ngay". Cach lam don gian:

1. Viet ra 20 viec/boi canh ban (hoac nguoi xung quanh) lap lai hang tuan.
2. Danh dau nhung cho "mat thoi gian", "de sai", "de quen", "de tre han", "de bi phat".
3. Moi muc, ghi them: ai dang bi dau dau? khi nao? tai sao? hau qua la gi?

Vi du noi dau:

- Lam bao cao hang tuan mat nhieu thoi gian.
- Chat voi khach hang qua nhieu kenh, bi sot tin.
- Sap xep tai lieu/anh/video rui tung, moi lan tim rat lau.
- Duyet hop dong dai, de bo sot rui ro.

Quan trong: dung dung o "van de" chung chung. Hay dich no thanh hanh vi va boi canh cu the.

## Step 3: Phan nhom nguoi dung theo chieu ngang

Mot y tuong co the dung voi nhieu nhom nguoi, nhung moi nhom co "gia tri" va "kha nang tra tien" khac nhau.

Hay phan nhom theo:

- Nghe nghiep/vi tri: van hanh, ke toan, HR, sales, giao vien, sinh vien...
- Quy mo: ca nhan, nhom nho, doanh nghiep.
- Tan suat: dung hang ngay hay thinh thoang?
- Chi phi cua van de: mat 10 phut hay mat 5 gio?

Muc tieu cua buoc nay: chon ra 1-2 nhom ma ban co the tiep can de phong van va kiem chung.

## Step 4: Dao sau boi canh theo chieu doc

De mo ta ro nhu cau, ban can biet:

1. Nguoi dung bat dau tu dau? (dau vao)
2. Ho thuong lam gi tiep theo? (cac buoc)
3. Cho nao hay bi ket? (nut that)
4. Sai sot thuong xay ra o dau? (rui ro)
5. Sau khi xong, ho can dau ra gi? (ket qua)

De lam nhanh, hay ve 1 "luong cong viec" gom 5-7 buoc. AI rat hop de giup ban sap xep va lam ro luong nay.

## Step 5: Kiem chung nhu cau that/gia

Nhieu y tuong nghe co ve hop ly nhung thuc ra la "nhu cau gia". Cach kiem chung:

- **Hoi ve hanh vi qua khu** thay vi y kien chung chung.
- **Hoi chi tiet chi phi**: mat bao lau, mat bao nhieu tien, bi anh huong ra sao.
- **Hoi giai phap hien tai**: ho dang dung gi de giai quyet? co phai ho da tu lam cach khac?
- **Hoi nguong tra tien**: trong tinh huong nao ho san sang tra?

Goi y cau hoi phong van:

1. Lan gan nhat ban gap van de nay la khi nao? Ban dang lam gi?
2. Ban da thu giai phap nao? Vi sao khong on?
3. Neu giai quyet duoc, ban duoc loi gi? (thoi gian, tien, rui ro, tinh than)
4. Neu co cong cu giai quyet, ban muon no lam gi truoc? Cai gi la "bat buoc"?

## Step 6: Mai dua khai niem san pham

Den day, ban co 3 thanh phan:

1. Mot nhom nguoi dung ro rang.
2. Mot boi canh ro rang.
3. Mot noi dau ro rang va co chi phi.

Gio hay viet 1 cau "dinh nghia san pham" theo mau:

> Doi voi [nhom nguoi dung], trong boi canh [tinh huong cu the], san pham nay giup ho [muc tieu] bang cach [cach lam], de giam [chi phi] va dat duoc [ket qua].

Vi du:

> Doi voi nhan vien van hanh TMĐT, khi can tao nhanh noi dung cho nhieu san pham, cong cu nay giup tao ban nhap anh va copy theo mau, de giam thoi gian lam thu cong va tang toc do len hang.

### Dung AI de mai dua (prompt mau)

Ban co the dua y tuong cho AI de:

- viet lai mo ta cho ro rang hon,
- de xuat 3 phien ban "dinh vi san pham" khac nhau,
- de xuat 10 cau hoi phong van,
- de xuat 3 gia thuyet nguoi dung va cach test.

Prompt goi y:

```txt
Toi co y tuong san pham sau:
[dan noi dung o day]

Hay giup toi:
1. Viet lai thanh 1 cau mo ta ro rang (1-2 cau).
2. Liet ke 5 tinh huong nguoi dung that su gap van de.
3. Viet 10 cau hoi phong van de kiem chung.
4. De xuat 3 phien ban dinh vi san pham khac nhau.
```

## Bai tap

1. Viet ra 10 noi dau hang ngay ban gap (hoac nguoi than ban be gap).
2. Chon 2 noi dau co chi phi ro rang va co nguoi co the phong van ngay.
3. Viet 1 cau "dinh nghia san pham" theo mau o tren.
4. Viet 10 cau hoi phong van va phong van it nhat 1 nguoi that.

Khi ban co 3 phan: nguoi dung + boi canh + noi dau, viec dung AI IDE de tao prototype se de hon rat nhieu.
