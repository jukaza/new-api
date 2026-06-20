# So cap 1: Thoi dai AI, biet noi la biet lap trinh

Day la mot bai hoc **hoc theo du an**. Ban hay lam theo tung buoc va co gang tai hien ket qua.
Dung lo sai hay sua. Hay nho:

<div style="text-align: center;">
<div style="display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px dashed #FFB6C1; background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%); margin: 12px 0;">
  <span style="font-size: 15px; font-weight: 500; color: #666;">Hoan thanh quan trong hon hoan hao</span>
</div>
</div>

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const duration = 'khoang <strong>4 gio</strong> (co the chia nhieu lan)'
const relatedArticles =
  relatedArticlesMap['vi-vn/stage-1/ai-capabilities-through-games'] ?? []
</script>

## Dan nhap chuong

<ChapterIntroduction :duration="duration" :tags="['Lap trinh doi thoai', 'Mini game AI-native', 'Thuc hanh Snake']" coreOutput="Snake AI-native + mini game tu tao" expectedOutput="1 Snake AI-native chay duoc + (tuy chon) 1 mini game/demo tu tao">

Neu ban <strong>hoan toan khong biet lap trinh</strong> hoac chi biet mot chut, chuong nay danh cho ban. Ta se bat dau tu co ban: dung <strong>doi thoai</strong> de AI giup ban viet code. Khong can nho cu phap, khong can cau hinh phuc tap, nhieu truong hop co the chay ngay tren web.

Ban se tu tay lam ra <strong>chuong trinh dau tien chay duoc</strong>: mot phien ban Snake co the "an tu", "viet tho", "ve ve". Ban se cam nhan lap trinh voi AI la gi: khong phai AI nghi thay ban, ma ban noi ro y muon, AI giup ban hien thuc.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Khoi dong', description: 'Thoi dai AI: biet noi la biet lap trinh' },
      { title: 'Kham pha nhanh', description: 'Trai nghiem 60 giay' },
      { title: 'Thuc hanh AI-native', description: 'Xay Snake AI-native' },
      { title: 'Mo rong sang tao', description: 'Tu lam mot game khac' }
    ]" />
  </ClientOnly>
</div>

## 1. Kho khan cua nguoi binh thuong va co hoi moi

Rat nhieu nguoi co y tuong san pham: cong cu ghi chep chi tieu, mot trang web ghi lai qua trinh lon len cua con, hoac mot mini game. Nhung chi can nghi toi "viet code" va "tim lap trinh vien" la thay met.

AI tao ra mot kha nang moi: ban khong nhat thiet phai biet code ngay lap tuc; ban can hoc cach noi ro rang voi AI ve dieu ban muon. Ke ca voi lap trinh vien chuyen nghiep, AI dang dan tro thanh mot phan cua quy trinh lam viec. Voi nguoi moi, kha nang "giao tiep dung voi agent" la cuc ky co gia tri.

Muc tieu cua bai hoc la giup ban hinh thanh ky nang moi: <strong>dung ngon ngu tu nhien de lam ung dung</strong>. Ban se hoc cach mo ta muc tieu, chia buoc, xac dinh dau vao/dau ra, va sua loi khi ket qua chua dung y.

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="1" :items="[
      { title: 'Kho khan va co hoi', description: 'Mot cach moi de tao san pham' },
      { title: 'Kham pha nhanh', description: 'Trai nghiem 60 giay' },
      { title: 'Thuc hanh AI-native', description: 'Xay Snake AI-native' },
      { title: 'Mo rong sang tao', description: 'Tu lam mot game khac' }
    ]" />
  </ClientOnly>
</div>

## 2. AI co the lam duoc toi muc nao hien nay

Cau hoi cu the: neu ban khong biet viet code, ban co the lam duoc toi muc nao voi AI doi thoai?

Thuc te, hien nay AI rat hop de:

- cong cu noi bo nho,
- bang dieu khien/truc quan du lieu,
- mini game nhe,
- prototype de kiem chung y tuong tu goc nhin san pham.

Voi san pham lon va dua vao san xuat, van can con nguoi dau tu vao thiet ke luong, chi tiet, bao mat, hieu nang va kha nang bao tri. Nhưng doi voi prototype va cong cu tu dung, chat luong da rat thuc dung.

### 2.1 Lam Snake trong 60 giay (voi z.ai)

Mo trang web thuc hanh cua khoa hoc: [z.ai](https://chat.z.ai/). Trong bai nay, ta dung che do "phat trien full-stack" de xem AI tao du an va xem truoc ket qua.

::: details Lap trinh ngay tren web la gi?

Truoc day, lam mot app web thuong can:

- cai moi truong (Node.js, Python),
- cau hinh editor,
- hoc HTML/CSS/JavaScript,
- xu ly dependency va loi.

Gio day, voi nen tang lap trinh AI:

- mo trinh duyet,
- mo ta tinh nang bang ngon ngu tu nhien,
- AI tu dong sinh code va xem truoc.

No chuyen trong tam tu "viet cu phap" sang "mo ta yeu cau".

:::

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-25-03.png)

Dan yeu cau don gian nhu sau va chay:

```txt
Lam giup toi game Snake:
1. Dieu khien bang phim mui ten
2. An thuc an thi dai ra va tang diem
3. Cham tuong hoac cham than thi Game Over
4. Co nut bat dau va choi lai
5. Giao dien gon va dep
```

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-34-03.png)

Khi xong, ban se thay trang web o ben phai. Thuong ban co the:

- cuon de xem,
- vao full-screen,
- tai du an,
- xem code.

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-35-11.png)

De xem ma nguon, bam vao bieu tuong code o goc tren ben phai.

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image7.png)

::: tip Thu them cong cu khac

Ngoai z.ai, ban co the thu nhieu cong cu khac. Dieu quan trong khong phai ten cong cu, ma la vong lap:

1. mo ta yeu cau,
2. thu chay,
3. chi ro hien tuong sai,
4. yeu cau sua cu the,
5. lap lai.

:::

### 2.2 Lap trinh doi thoai lam duoc gi va khong lam duoc gi

Tom tat thuc dung:

- AI rat gioi voi bai toan "nho va ro rang" neu ban mo ta UI va tuong tac cu the.
- Voi du an lon, ban can goc nhin theo quy trinh: chia thanh buoc, dinh nghia input/output va giao cho AI lam tung phan.
- "Viet duoc" khong dong nghia "dung duoc cho nguoi that". San xuat can test, bao mat va review.

::: warning Huong dan theo tinh huong

- **Prototype / demo / cong cu noi bo**: rat hop de AI lam ban dau, ban iter tiep.
- **San pham lon cho nguoi dung that**: can dau tu dai han ve ky thuat.
- **He thong yeu cau bao mat/tuân thu cao (thanh toan, y te, rui ro)**: khong nen "sinh xong la deploy", phai co quy trinh kiem tra nghiem ngat.

:::

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="2" :items="[
      { title: 'Kho khan va co hoi', description: 'Mot cach moi de tao san pham' },
      { title: 'Kham pha nhanh', description: 'Trai nghiem 60 giay' },
      { title: 'Thuc hanh AI-native', description: 'Xay Snake AI-native' },
      { title: 'Mo rong sang tao', description: 'Tu lam mot game khac' }
    ]" />
  </ClientOnly>
</div>

## 3. Thuc hanh: lam mot Snake "AI-native"

"AI-native" o day nghia la: game khong chi la Snake co ban, ma co them mot kha nang AI gan vao gameplay. Vi du:

- an mot tu thi dich va tao vi du cau,
- an mot chu de thi sinh ra mot cau/noi dung ngan,
- an mot prompt thi sinh ra mot hinh.

Quan trong nhat la tap quy trinh: mo ta ro -> de AI lam -> thu chay -> sua theo ket qua.

> Meo khi yeu cau sua:
>
> 1. mo ta hien tuong quan sat duoc,
> 2. noi ro hanh vi ky vong,
> 3. neu co loi, copy day du log/stack,
> 4. yeu cau sua toi thieu can thiet.

De theo doi trinh tu thuc hanh, ban se thay cac anh minh hoa:

> ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image12.png)
>
>    ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image13.png)
>
> ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image14.png)

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image15.png)

Khi gap loi, dung doan. Hay copy loi va yeu cau AI giai thich bang ngon ngu don gian, sau do dua ra sua doi cu the.

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image56.png)
![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image57.png)
![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image58.png)

## 4. Mo rong: tu lam mot mini game cua rieng ban

Khi Snake da chay, muc tieu khong phai nho het code, ma la tao bien the.

Goi y:

- game phan xa (bam dung thoi diem),
- quiz tu vung,
- dong ho dem nguoc voi phan thuong,
- tao the (card) voi diem so.

Buoc quan trong: dinh nghia vong lap cua game (input -> state -> output) roi moi nho AI implement.

![1767350588191](../../../zh-cn/stage-1/ai-capabilities-through-games/images/1767350588191.png)

## Bai tap

1. Lam lai Snake co ban voi mau sac va UI cua ban.
2. Them it nhat 1 kha nang AI (dich, tom tat, sinh text...).
3. Tu tao mot mini game/dem o don gian nhung choi duoc.

## Buoc tiep theo

O cac chuong tiep theo, ta se ket noi cac nang luc AI cu the hon (text-to-text, image-to-text, text-to-image) va tien toi cac du an day du hon.

<RelatedArticles :articles="relatedArticles" />
---
title: 'So cap 1: Thoi dai AI, noi la lap trinh'
description: 'Lam game ran AI-native bang doi thoai, sau do ap dung workflow de tao mini game hoac demo cua rieng ban.'
---
