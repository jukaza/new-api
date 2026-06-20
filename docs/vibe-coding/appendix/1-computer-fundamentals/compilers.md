# Nhap mon Nguyen ly Bien dich

::: tip Loi noi dau
**Khi ban nhan nut "chay", lam the nao code bien thanh ket qua tren man hinh?** Moi dong code ban viet, may tinh thuc chat "khong hieu" -- no chi nhan dien 0 va 1. Trinh bien dich chinh la "nguoi dich" chuyen ngon ngu con nguoi thanh ngon ngu may. Hieu nguyen ly bien dich giup ban hieu thong bao loi den tu dau, tai sao mot so ngon ngu nhanh mot so cham, va logic co ban cua toi uu hoa code.
:::

**Bai viet nay se giup ban hoc gi?**

Sau khi hoc xong chuong nay, ban se co duoc:

- **Tam nhin toan cau**: lam chu day chuyen bien dich hoan chinh tu ma nguon den chuong trinh thuc thi
- **Phan tich tu vung**: hieu trinh bien dich chia code thanh cac Token nhu the nao
- **Phan tich ngu phap**: hieu qua trinh xay dung AST (Cay Ngu phap Truu tuong)
- **Truc quan hoa AST**: nhin thay truc tiep cau truc cay cua code
- **Phan tich ngu nghia va toi uu**: hieu nguyen ly kiem tra kieu va toi uu hoa code
- **Thuc hanh ky thuat toi uu**: lam chu cac ky thuat cot loi nhu gap lai hang so, loai bo code chet
- **Mo hinh thuc thi**: phan biet giua bien dich, thong dich va JIT

| Chuong | Noi dung | Khai niem cot loi |
|-----|------|---------|
| **Chuong 1** | Trinh bien dich la gi | Vi du nguoi dich, day chuyen bien dich |
| **Chuong 2** | Phan tich tu vung | Token, quy tac tu vung |
| **Chuong 3** | Phan tich ngu phap | AST, cay ngu phap, uu tien |
| **Chuong 4** | Truc quan hoa AST | Cay ngu phap tuong tac, loai nut |
| **Chuong 5** | Phan tich ngu nghia va toi uu | Kiem tra kieu, gap lai hang so, loai bo code chet |
| **Chuong 6** | Thuc hanh ky thuat toi uu | Chen inline ham, tach ngoai vong lap, truyen hang so |
| **Chuong 7** | Bien dich vs Thong dich vs JIT | So sanh ba mo hinh thuc thi |

---

## 0. Toan canh: "Hanh trinh dich" cua code

Tuong tuong ban la mot nguoi dich, can dich mot cuon tieu thuyet Trung Quoc sang tieng Anh. Ban se khong dich tung chu mot cach khac dinh, ma:

1. **Nhan dien tu vung** -- chia cau thanh tung tu (phan tich tu vung)
2. **Hieu ngu phap** -- xac dinh cau truc cau co dung khong (phan tich ngu phap)
3. **Hieu ngu nghia** -- dam bao y nghia lien mach, khong co mau thuan (phan tich ngu nghia)
4. **Chinh sua toi uu** -- lam ban dich tu nhien va truot hon (toi uu hoa code)
5. **Xuat ban dich** -- viet phien ban tieng Anh cuoi cung (tao ma code)

Trinh bien dich lam dung nhung dieu do, chi khac la no dich ngon ngu lap trinh.

<CompilerAnalogyDemo />

---

## 1. Day chuyen sau buoc cua trinh bien dich

Cong viec cua trinh bien dich co the chia thanh sau giai doan, nhu day chuyen san xuat trong nha may, moi giai doan xu ly xong roi truyen cho giai doan tiep theo.

<CompilerDemo />

::: tip Day chuyen bien dich
1. **Phan tich tu vung (Lexical Analysis)**: chia ma nguon thanh cac Token (tu vung)
2. **Phan tich ngu phap (Syntax Analysis)**: to chuc Token thanh cay ngu phap (AST)
3. **Phan tich ngu nghia (Semantic Analysis)**: kiem tra kieu co dung khong, bien da duoc khai bao chua
4. **Tao ma trung gian (IR Generation)**: tao bieu dien trung gian doc lap voi nen tang
5. **Toi uu hoa code (Optimization)**: lam ma trung gian hieu qua hon
6. **Tao ma code (Code Generation)**: tao ma may cho nen tang dich
:::

| Giai doan | Dau vao | Dau ra | Vi du |
|------|------|------|------|
| Phan tich tu vung | Luong ky tu ma nguon | Luong Token | Chia cau thanh tu |
| Phan tich ngu phap | Luong Token | AST (cay ngu phap) | Phan tich cau truc cau |
| Phan tich ngu nghia | AST | AST co kieu | Kiem tra y nghia co dung khong |
| Ma trung gian | AST co kieu | IR | Viet ban nhap |
| Toi uu hoa code | IR | IR da toi uu | Chinh sua va giam bot |
| Tao ma code | IR da toi uu | Ma may | Xuat ban cuoi |

---

## 2. Phan tich tu vung: chia code thanh "tu vung"

Phan tich tu vung la buoc dau tien cua bien dich. Trinh bien dich quet tung ky tu ma nguon tu trai sang phai, gop chung thanh cac **Token (don vi tu vung)** co y nghia.

<LexerTokenDemo />

Giong nhu khi ban doc cau tieng Anh, oc cua ban tu dong gop cac chu cai thanh tu, phan tich tu vung gop cac ky tu thanh Token:

```
Ma nguon: let x = 10 + 5;

Luong Token:
[let]   → Tu khoa (tu duoc giu cua ngon ngu)
[x]     → Danh hieu (ten bien)
[=]     → Toan tu (gan)
[10]    → Gia tri so nguyen
[+]     → Toan tu (cong)
[5]     → Gia tri so nguyen
[;]     → Phan cach (ket thuc cau lenh)
```

::: tip Nam loai Token
- **Tu khoa**: cac tu dac biet duoc giu cua ngon ngu, nhu `let`, `if`, `return`, `function`
- **Danh hieu**: ten do lap trinh vien dinh nghia, nhu ten bien, ten ham
- **Gia tri nguyen ban**: gia tri viet truc tiep trong code, nhu so `42`, chuoi `"hello"`
- **Toan tu**: ky hieu thuc hien phep toan, nhu `+`, `-`, `=`, `===`
- **Phan cach**: ky hieu phan tach cau truc code, nhu `;`, `,`, `(`, `)`
:::

---

## 3. Phan tich ngu phap: xay dung cay ngu phap (AST)

Phan tich tu vung chia code thanh Token, nhung Token chi la nhung "tu vung" rieng re. Nhiem vu cua phan tich ngu phap la to chuc cac Token nay theo quy tac ngu phap thanh mot **Cay Ngu phap Truu tuong (Abstract Syntax Tree, AST)** -- phan anh cau truc cua code va thu tu uu tien phep toan.

```
Bieu thuc: 1 + 2 * 3

Cay ngu phap:        Tai sao nhu vay?
       +       Vi muc uu tien cua *
      / \      cao hon +, nen
     1   *     2 * 3 duoc ket hop truoc
        / \    thanh mot cay con
       2   3
```

::: tip Tam quan trong cua AST
AST la "cau truc du lieu cot loi" cua trinh bien dich; phan tich ngu nghia, toi uu va tao ma ve sau deu dua tren no. Cong cu phat trien hien dai cung su dung AST rat nhieu:
- **ESLint**: phan tich code thanh AST, kiem tra co vi pham quy tac khong
- **Prettier**: phan tich thanh AST roi dinh dang lai dau ra
- **Babel**: phan tich AST → chuyen doi → tao ma tuong thich
- **Cau truc lai trong IDE**: doi ten bien an toan, trich xuat ham dua tren AST
:::

| Cau truc ngu phap | Trinh tu Token | Nut AST |
|---------|-----------|---------|
| Khai bao bien | `let` `x` `=` `10` | VariableDeclaration → Identifier + Literal |
| Goi ham | `add` `(` `1` `,` `2` `)` | CallExpression → Identifier + Arguments |
| Cau dieu kien | `if` `(` `a` `>` `b` `)` | IfStatement → BinaryExpression + Block |

---

## 4. Truc quan hoa AST: nhin thay "khung xuong" cua code

O tren chung ta da mo ta cau truc AST bang van ban, nhung "nhin thay" truc quan hon "doc duoc". Thanh phan tuong tac duoi day cho phep ban chon cac bieu thuc khac nhau, quan sat truc tiep cay ngu phap cua chung nhu the nao.

<ASTVisualizerDemo />

Thong qua truc quan hoa ban se phat hien ra rang, cac quy luat cot loi cua AST thuc ra rat don gian:

| Cau truc code | Nut goc AST | Nut con |
|---------|-----------|-------|
| `1 + 2 * 3` | BinaryExpression (+) | Trai: NumericLiteral(1), Phai: BinaryExpression(*) |
| `let x = 10` | VariableDeclaration | VariableDeclarator → Identifier(x) + NumericLiteral(10) |
| `add(a, b)` | CallExpression | Identifier(add) + Arguments(a, b) |

::: tip Ung dung cua AST trong phat trien hang ngay
Ban co the chua tung viet trinh bien dich truc tiep, nhung ban dang dung cong cu dua tren AST moi ngay:
- **ESLint / Prettier**: phan tich code thanh AST, kiem tra quy tac hoac dinh dang lai
- **Babel / SWC**: phan tich AST → chuyen doi ngu phap → tao ma tuong thich
- **Cau truc lai trong IDE**: doi ten an toan, trich xuat ham dua tren AST
- **Tree-shaking**: phan tich import/export trong AST, xoa code khong su dung
:::

---

## 5. Phan tich ngu nghia va toi uu hoa code

Phan tich ngu phap dam bao code "dung cau truc", nhung dung cau truc khong co nghia la "dung y nghia". Phan tich ngu nghia kiem tra y nghia cua code co hop le khong, con toi uu hoa code lam chuong trinh chay nhanh hon.

<CompilationPracticeDemo />

### 4.1 Phan tich ngu nghia: kiem tra "y nghia" co dung khong

| Noi dung kiem tra | Vi du | Ket qua |
|---------|------|------|
| Kiem tra kieu | `int x = "hello"` | Kieu khong khop |
| Kiem tra pham vi | Su dung bien chua khai bao `y` | Bien khong ton tai |
| Sue dien kieu | `1 + 2.0` | Sue dien ket qua la float |
| Kiem tra tham so | `add(1, 2, 3)` nhung ham chi nhan 2 tham so | So luong tham so khong khop |

::: tip Cac loi ban gap, phan lon den tu phan tich ngu nghia
- `TypeError: Cannot read properties of undefined` — kiem tra kieu
- `ReferenceError: x is not defined` — kiem tra pham vi
- `Expected 2 arguments, but got 3` — kiem tra tham so
:::

### 4.2 Toi uu hoa code: lam chuong trinh nhanh hon

Truoc khi tao ma cuoi cung, trinh bien dich thuc hien cac toi uu hoa khac nhau cho ma trung gian. Cac toi uu hoa nay trong suot voi lap trinh vien, nhung co the cai thien hieu suat dang ke.

| Ky thuat toi uu | Truoc | Sau | Nguyen ly |
|---------|-------|-------|------|
| Gap lai hang so | `x = 10 + 5` | `x = 15` | Tinh ket qua truc tiep khi bien dich |
| Loai bo code chet | `if (false) { ... }` | Xoa truc tiep | Code khong bao gio thuc thi |
| Truyen hang so | `x = 15; y = x * 2` | `y = 30` | Thay the truc tiep bang gia tri da biet |
| Tach bien ngoai vong lap | Tinh toan lap lai `len = arr.length` trong vong lap | Tach ra ngoai vong lap | Tranh tinh toan lap lai |

---

## 6. Thuc hanh ky thuat toi uu: trinh bien dich lam code nhanh hon nhu the nao

O tren chung ta da nhac den ten cua mot so ky thuat toi uu, bay gio hay xem chi tiet trinh bien dich lam cu the nhu the nao. Thanh phan tuong tac duoi day hien thi 5 toi uu hoa trinh bien dich pho bien nhat, ban co the so sanh truc quan su khac biet truoc va sau toi uu.

<CodeOptimizationDemo />

Cac trinh bien dich hien dai va dong co JIT (nhu V8, GCC, LLVM) tu dong ap dung hang chuc ky thuat toi uu. La mot lap trinh vien, ban khong can lam cac toi uu nay thu cong, nhung hieu chung giup ban:

- **Viet code de toi uu hon**: vi du, dung `const` thay vi `let`, trinh bien dich de gap lai hang so hon
- **Hieu su khac biet hieu suat**: tai sao ham nho nhanh hon ham lon? Vi trinh bien dich co the chen inline chung
- **Tranh "giai toi uu"**: mot so cach viet ngan can toi uu cua trinh bien dich, nhu `eval()` va `with`

| Ky thuat toi uu | Dieu kien kich hoat | Tac dong hieu suat | Lap trinh vien co the lam gi |
|---------|---------|---------|-------------|
| Gap lai hang so | Bieu thuc toan hang so | Loai bo tinh toan luc chay | Su dung nhieu khai bao const |
| Loai bo code chet | Code khong the den hoac ket qua khong su dung | Giam kich thuoc code | Don sach code khong su dung kip thoi |
| Tach bien ngoai vong lap | Tinh toan khong doi trong vong lap | Giam tinh toan lap lai | Tach thu cong cung la thoi quen tot |
| Chen inline ham | Ham nho duoc goi thuong xuyen | Loai bo chi phi goi ham | Giu ham nho va tap trung |
| Truyen hang so | Gia tri bien xac dinh duoc khi bien dich | Ca day tinh toan bi loai bo | Dung hang so thay vi so than bien |

---

## 7. Bien dich vs Thong dich vs JIT

Sau khi viet xong code, co ba "cach dich" de chay no. Ba cach nay co uu nhuoc diem rieng, quyet dinh truc tiep dac tinh hieu suat va truong hop su dung cua ngon ngu.

<CompileVsInterpretDemo />

| Chieu | Bien dich | Thong dich | JIT (Bien dich luc chay) |
|------|-------|-------|------------|
| Qua trinh | Bien dich toan bo thanh ma may truoc, roi chay | Doc va chay tung dong, dich truc tuyen | Thong dich truoc, roi bien dich ma nong |
| Toc do chay | Nhanh nhat | Cham nhat | Trung binh (ma nong gan bang bien dich) |
| Toc do khoi dong | Cham (can bien dich) | Nhanh (chay truc tiep) | Trung binh (can lam nong) |
| Da nen tang | Can bien dich lai | Tu nhien da nen tang | Da nen tang |
| Ngon ngu dai dien | C, Rust, Go | Python, Ruby | JavaScript (V8), Java |

::: tip Vi sao JavaScript nhanh nhu vay?
Trinh bien dich JIT cua dong co V8 theo doi doan code nao duoc thuc thi thuong xuyen (ma nong), roi bien dich no thanh ma may duoc toi uu cao. Vi vay mac dau JavaScript la "ngon ngu thong dich", nhung trong V8 hieu suat cua no co the gan bang ngon ngu bien dich. Day cung la co so de Node.js co the lam may chu.
:::

---

## Tom tat

Nguyen ly bien dich khong phai la kien thuc chi danh cho nhung nguoi phat trien trinh bien dich. Hieu qua trinh bien dich giup ban hieu tot hon thong bao loi, chon ngon ngu phu hop va viet code hieu qua hon.

Tom tat cac diem cot loi cua chuong nay:

1. **Trinh bien dich la nguoi dich**: chuyen code doc duoc boi con nguoi thanh lenh thuc thi duoc boi may
2. **Day chuyen sau buoc**: phan tich tu vung → phan tich ngu phap → phan tich ngu nghia → ma trung gian → toi uu → tao ma
3. **Phan tich tu vung chia Token**: chia luong ky tu thanh don vi co y nghia nhu tu khoa, danh hieu, toan tu
4. **Phan tich ngu phap xay dung AST**: to chuc Token thanh cau truc cay theo quy tac ngu phap, phan anh thu tu uu tien phep toan
5. **Phan tich ngu nghia dam bao dung**: kiem tra kieu, kiem tra pham vi; phan lon loi ban gap deu den tu day
6. **Trinh bien dich tu dong toi uu**: cac ky thuat nhu gap lai hang so, loai bo code chet, chen inline ham lam code tu dong nhanh hon
7. **Ba mo hinh thuc thi**: bien dich nhanh nhat, thong dich linh hoat nhat, JIT ket hop ca hai

## Doc them

- [AST Explorer](https://astexplorer.net/) - Xem truc tuyen cau truc AST cua code
- [Crafting Interpreters](https://craftinginterpreters.com/) - Thuc hien mot ngon ngu lap trinh tu dau (sach truc tuyen mien phi)
- [The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler) - Trinh bien dich nho implemented bang JavaScript
- [V8 Blog](https://v8.dev/blog) - Blog ky thuat bien dich JIT cua dong co V8
- [Trang chu LLVM](https://llvm.org/) - Ha tang trinh bien dich pho bien nhat
