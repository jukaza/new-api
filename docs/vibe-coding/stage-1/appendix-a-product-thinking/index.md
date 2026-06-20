---
title: 'Tu duy san pham va thiet ke giai phap'
description: 'Chuyen tu "lam tool" sang "lam san pham": nguon y tuong, cach tach nho thanh MVP, cai thien trai nghiem va dung AI de tang gia tri.'
---

<script setup>
const duration = 'Khoang <strong>6 gio</strong>'
</script>

# Tu duy san pham va thiet ke giai phap

## Gioi thieu chuong

<ChapterIntroduction :duration="duration" :tags="['Tu duy san pham', 'Phan tich nhu cau', 'Thiet ke giai phap', 'Hieu nguoi dung']" coreOutput="1 ban phac thao san pham hoan chinh" expectedOutput="Huong san pham co the trien khai">

O cac chuong truoc, ban da quen voi viec dung AI IDE de lam prototype va cac tool nho. Phan nay tap trung vao cau hoi lon hon: <strong>"Lam gi thi dang?"</strong>

Muc tieu:

1. Tim y tuong dang tin hon (khong chi la cam hung).
2. Bien y tuong thanh mot flow co the build.
3. Di tu "chay duoc" sang "nguoi ta thich dung".
4. Dung AI o dung cho, de tang gia tri that.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Nguon y tuong', description: 'Tim y tuong dang tin' },
      { title: 'Tach nho giai phap', description: 'Bien y tuong thanh app co the lam' },
      { title: 'Danh gia va cai thien', description: 'Tu dung duoc den dung suong' },
      { title: 'AI phong dai gia tri', description: 'Dung AI hop ly' }
    ]" />
  </ClientOnly>
</div>

## Ban se hoc duoc gi

Sau phan nay, ban co the tra loi:

1. Y tuong den tu dau thi on?
2. Tach y tuong ra sao de lam MVP?
3. Lam sao de biet app co tot khong va cach nang cap?
4. Dung AI o buoc nao de tang gia tri?
5. Tim nguoi dung dau tien nhu the nao?

---

# 1. Nguon y tuong dang tin

Ban khong can "y tuong sieu doc". Ban can van de that, lap lai, trong boi canh ro rang.

## 1.1 The nao la mot y tuong (theo goc san pham)?

Mot y tuong co the build can:

1. Nguoi dung muc tieu ro rang (ai?).
2. Tinh huong cu the (khi nao/o dau?).
3. Nhiem vu cu the (muon dat ket qua gi?).
4. Cai tien hop ly so voi cach lam hien tai.

## 1.2 Y tuong vs nhu cau that

Y tuong la gia thuyet. Nhu cau that la thu nguoi dung dang tu tim cach giai (du la workaround).

Quy tac nhanh:

- Nhu cau that: nguoi dung dang tra gia bang thoi gian/tien/cong suc.
- Nhu cau gia: nghe hay nhung khong doi hanh vi, khong tra tien.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image2.png)

## 1.3 Vi sao co y tuong tu nhien tang truong

Neu gia tri den nhanh va flow ngan, nguoi dung se tu gioi thieu:

Van de -> gia tri nho ngay lap tuc -> lap lai -> gioi thieu.

Neu can "keo" lien tuc bang quang cao va giai thich, thuong la dau hieu pain chua du manh.

## 1.4 4 nguon y tuong on dinh

1. Cong viec hang ngay: quy trinh lap, bao cao, phoi hop, QA.
2. Cong dong: cau hoi lap lai, van de nhieu nguoi gap.
3. Review/binh luan: ma sat, buc xuc "sao kho vay?".
4. San pham co san: tim lo hong (qua dat, qua phuc tap, thieu chuyen sau).

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image3.png)

---

# 2. Tach nho: tu y tuong thanh app

Y tuong chi build duoc khi chuyen thanh quyet dinh.

## 2.1 Toi thieu: nguoi dung, tinh huong, flow

Xac dinh:

1. Nguoi dung: vai tro, muc tieu, rang buoc, kha nang chi tra.
2. Tinh huong: trigger -> cac buoc -> ket qua.
3. Flow chinh: 3-7 buoc de tao gia tri.

## 2.2 Cat scope (MVP)

MVP khong phai "it feature", ma la "loi hua ro rang va lam duoc".

Cau hoi:

- Phut dau tien nao nguoi dung thay "co loi"?
- Cat gi ma khong lam mat gia tri cot loi?
- Gia thuyet rui ro nhat la gi? (can validate som)

---

# 3. Cai thien: tu dung duoc den dung suong

Sau khi co ban dau, tap trung vao:

1. Ro rang: nguoi moi biet lam gi tiep theo.
2. It ma sat: it click, it form, it doi.
3. Tao tin tuong: ket qua giai thich duoc, default an toan.

Test nhanh: nguoi moi co the nhan gia tri trong 60 giay khong?

---

# 4. Dung AI de phong dai gia tri

AI manh nhat khi:

1. Bien ngon ngu thanh cau truc (text -> task, note -> plan).
2. Tom tat va uu tien (nhieu thong tin -> hanh dong).
3. Ca nhan hoa (goi y theo boi canh).

AI yeu khi chi "dan chat" ma khong cai thien flow cot loi.

---

## Output mong doi

Mot ban phac thao san pham gom:

1. Nguoi dung va use-case
2. Van de cot loi va chi phi hien tai
3. Flow chinh (3-7 buoc)
4. Scope MVP
5. Ke hoach validate (7 ngay) va metric

<RelatedArticlesSection />

