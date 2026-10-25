---
title: "Recap The Future of Software Engineering: Auditable Autonomy, làm việc cùng AI teammate để lại dấu vết"
subtitle: "Coding agent đã làm tốt cho một người trong một terminal. Lên quy mô team thì cần thêm: ai chịu trách nhiệm request, output nằm ở đâu, gate nào có người duyệt, và trace đủ để ba tháng sau vẫn đọc lại được."
description: "Recap bài nói của mình ở The Future of Software Engineering in the Agentic AI era, buổi chia sẻ nội bộ tại Viettel Digital: từ pipeline agent cá nhân đến một hướng thiết kế cho AI ở quy mô team, có shared state, gate do người duyệt và trace."
date: 2026-05-28
tags: ["talk", "ai-agents", "agentic-workflows", "observability", "developer-tools"]
translationOf: recap-auditable-autonomy
---

*[Read in English](/articles/recap-auditable-autonomy.html).*

Coding agent bây giờ đã làm khá tốt khi phục vụ một người trong một terminal. Câu hỏi khó hơn là một
team cần gì trước khi giao việc thật cho agent. Đó là nội dung bài nói của mình ở The Future of Software
Engineering in the Agentic AI era, một buổi chia sẻ nội bộ tại Viettel Digital. Bộ slide đầy đủ là tài liệu
nội bộ nên bài recap này kể lại các ý chính kèm vài slide minh hoạ: workflow AI cá nhân dừng ở đâu, và một hướng thiết kế cho bước
tiếp theo.

![Mình đang chia sẻ ở The Future of Software Engineering, 28/5/2026](/img/talks/2026-05-28/photo-speaking.jpg)

## Bốn nấc từ prompting đến một team agent

Mình mở đầu bằng bốn nấc mà chắc nhiều kỹ sư đã đi qua:

1. **Prompting.** Hỏi, copy, paste. Người vẫn cầm lái 100%.
2. **Coding agent.** Claude Code, Codex, Cursor. Agent tự đọc repo, sửa file, chạy test.
3. **Agent tự chạy cho từng người.** Mỗi người giao task, agent tự plan, implement và commit.
4. **Agent tự chạy ở quy mô team.** Nhiều agent và nhiều người cùng làm trên task chung, và mỗi bước
   đều để lại trace cho người khác audit được.

![Bốn nấc từ prompting đến AI tự chạy ở quy mô team](/img/talks/2026-05-28/slide-5.jpg)

AI giờ không chỉ giúp viết code nữa mà đang định hình lại cả vòng đời phát triển phần mềm. Còn bước nhảy
từ nấc 3 lên nấc 4 thì nằm ở những thứ bao quanh model nhiều hơn là ở bản thân model.

## Một request không phải một câu prompt

Team mình làm [BrainBrew DevKit](https://github.com/brainbrewlabs/brainbrew-devkit) cho nấc 3. Nó nối
các agent thành chain trong Claude Code, Codex hoặc opencode: một agent lập kế hoạch, một agent review
kế hoạch, một agent implement, một nhóm review song song, một agent test, một agent commit. Chain là một
file YAML nằm ngay trong repo:

```yaml
flow:
  researcher:
    routes:
      writer: "Research done"
  writer:
    routes:
      editor: "Draft done"
  editor:
    routes:
      END: "Approved"
```

Agent và skill đều là file markdown nên được version control như mọi thứ khác. Hooks chạy lúc agent bắt
đầu và kết thúc, output của agent trước được đưa vào agent sau, còn một model nhỏ đọc output đó để chọn
bước tiếp theo.

![Cách một chain chạy: hook bao quanh mỗi lượt agent, một model chọn route tiếp theo, output trước được đưa vào agent sau](/img/talks/2026-05-28/slide-7.jpg)

Phần mình thích nhất là cách nó xử lý lỗi. Trong chain, lỗi chỉ là một route nữa. Tester fail thì chuyển
sang debugger, debugger tìm root cause, implementer sửa, rồi review và test chạy lại. "AI fail" không còn
là điểm dừng mà chỉ là một vòng của vòng lặp.

![Chain develop: planner, plan-reviewer, implementer, nhóm review song song, tester và git-manager, có vòng quay lại khi cần sửa plan, khi review thấy lỗi và khi test fail](/img/talks/2026-05-28/slide-10.jpg)

Chain cũng không cần viết tay. Bạn chỉ cần mô tả ("I need: design review → implement → security scan →
deploy"), agent chain-builder sẽ đọc codebase rồi viết chain cho phù hợp.

## Những câu một terminal không trả lời được

Dùng hằng ngày thì mình nhận ra một điều: request không chỉ cần được trả lời, mà phải đi đến resolution.
Plan, implement, review, test, debug, xong. Đó là tư duy pipeline.

Nhưng đặt những gì pipeline cho bạn trên một laptop cạnh những câu team sẽ hỏi thì thấy ngay khoảng trống:

![Pipeline cá nhân và những câu team sẽ hỏi](/img/talks/2026-05-28/slide-12.jpg)

Mọi câu ở cột bên phải đều là câu hỏi về shared state. Agent có giỏi đến đâu thì scrollback của một người
cũng không trả lời được.

## Nâng pipeline từ một terminal lên cả team

Lên quy mô team thì tư duy pipeline vẫn giữ nguyên: request vào, resolution ra, có vòng lặp khi gặp lỗi.
Cái thay đổi là chỗ mà từng phần của nó nằm. Trên một laptop, chain nằm trong repo của mình, state nằm
trong đầu mình, còn bản ghi thì nằm trong scrollback. Với cả team, cả ba thứ đó phải chuyển ra chỗ dùng
chung:

- **Chain ra khỏi terminal và lên board.** Agent trở thành đồng đội mà ai cũng assign được, còn request
  trở thành một issue mà cả team đều thấy.
- **Chain trở thành state machine gắn với từng issue.** Phase, vòng lặp và gate có người duyệt là một
  phần của pipeline, chứ không còn là thứ một người phải tự nhớ.
- **Scrollback trở thành trace.** Mọi pipeline run, lượt agent và tool call đều được ghi lại ở chỗ người
  khác mở ra xem được về sau.

Nửa sau của talk là một hướng thiết kế cho đúng ba bước chuyển đó, dùng ba công cụ mở, mỗi công cụ lo một
bước. Đặt cạnh năm câu hỏi của team ở trên thì sẽ thấy rõ:

| Team hỏi | Mảnh trả lời |
|---|---|
| Ai đang chịu trách nhiệm request này? | Multica: issue có assignee, là người hay agent đều được |
| Phase nào đang chạy, ở runtime nào? | LangGraph giữ phase, daemon của Multica chạy nó trên một runtime xác định |
| Output nằm ở branch nào, PR nào? | Multica: agent báo PR ngay trên issue |
| Gate nào cần người duyệt? | LangGraph: pipeline dừng lại khi xong một sub-issue |
| Ba tháng sau có trace lại được không? | Langfuse: pipeline run, agent turn và tool call |

**[Multica](https://github.com/multica-ai/multica) là nơi chứa công việc.** Đây là workspace
source-available, tự host được, dành cho một team gồm cả người và AI agent, và chạy được với các agent
CLI mà mọi người đang dùng sẵn.

![Multica: workspace nơi người và AI agent làm việc như một team, kèm kiến trúc](/img/talks/2026-05-28/slide-14.jpg)

Agent xuất hiện trên board như một đồng đội: có profile, instructions, runtime và skills, được assign
issue, comment trong lúc làm và tự cập nhật status. Người và agent dùng chung board, inbox và timeline,
nên "ai làm gì, lúc nào" chỉ nằm trên một luồng.

![Agents as teammates: agent nằm chung board với người, mỗi issue có một luồng hoạt động](/img/talks/2026-05-28/slide-16.jpg)

Điều mình thấy hay nhất là cách nó nói chuyện với agent. Mỗi agent CLI có định dạng input, output và tool
call riêng. Multica chạy một daemon trên máy bạn kiểm soát. Daemon nhận task ở dạng chuẩn hoá từ server,
dịch sang lệnh đúng cho Claude Code, Codex, OpenCode hay CLI nào mà agent đó dùng, rồi gửi kết quả về.
Nhờ vậy không bị khoá vào agent của một vendor.

![Multi-runtime daemon: mỗi máy một daemon, dịch task sang lệnh của từng agent CLI](/img/talks/2026-05-28/slide-15.jpg)

**[LangGraph](https://github.com/langchain-ai/langgraph) là bộ não của pipeline.** Ticket trên board thì
nằm im. Trong thiết kế này, mỗi task được gắn với một pipeline, tức là một state machine có feedback loop:
node test phát hiện lỗi thì đẩy code ngược về dev agent kèm log lỗi. Vẫn là vòng lặp của chain cá nhân,
chỉ khác là giờ nó thuộc về issue chứ không thuộc về người đã chạy nó.

Và nó dừng có chủ đích. Pipeline tự chạy đến khi xong một sub-issue thì chờ người duyệt rồi mới sang phase
tiếp. Không ai phải ngồi canh cả ngày, mà cũng không có gì vượt gate khi chưa có người gật đầu.

![LangGraph làm engine điều phối: mỗi task gắn với một pipeline có feedback loop và gate do người duyệt ở từng phase](/img/talks/2026-05-28/slide-17.jpg)

**[Langfuse](https://github.com/langfuse/langfuse) là trace.** Nó ghi lại ba tầng:

- **Pipeline run:** việc đang nằm ở agent nào, mỗi phase mất bao lâu.
- **Agent turn:** cuộc trao đổi qua lại giữa các agent, kể cả chỗ agent này phản biện agent kia.
- **Tool call:** từng lệnh bash, từng file được đọc hay ghi, từng dòng code bị sửa.

![Langfuse trace pipeline run, từng lượt agent và từng tool call](/img/talks/2026-05-28/slide-18.jpg)

Tóm lại: Multica là bề mặt công việc, LangGraph là state machine, Langfuse là audit trail. Tính tự chủ và
khả năng audit phải đi cùng nhau.

![Multica, LangGraph và Langfuse ghép lại: pipeline khai báo theo phase, mỗi phase có role, agent và vòng lặp riêng](/img/talks/2026-05-28/slide-19.jpg)

## Đặt agent ở chỗ có context

Slide thiết kế cuối nói về chuyện agent chạy ở đâu. Bạn mô tả intent bằng ngôn ngữ tự nhiên, kiểu "ship
feature X to staging", rồi platform chuyển nó thành pipeline có phase, gate và check rõ ràng. Sau đó từng
phase được đưa về runtime hợp với context của nó:

![Intent đi vào orchestrator, được chia thành phase và gate, dispatch xuống runtime dev, staging, secure, và giữ audit trail](/img/talks/2026-05-28/slide-21.jpg)

- **Dev runtime** cho feature branch, unit test, linter, và chỉ giữ dev secret.
- **Staging runtime** cho staging branch và database, integration test và e2e test, giữ staging secret.
- **Secure/internal runtime** cho dữ liệu prod chỉ đọc, hạ tầng và observability, secret lấy từ vault.

Orchestrator lo việc plan, dispatch, giữ audit trail và các lần duyệt. Runtime nào cũng chạy cùng các agent
CLI, nhưng mỗi nơi chỉ thấy đúng thứ phase đó cần. Cũng là ý least privilege mà mình vẫn áp cho CI runner,
giờ áp cho agent.

![Trên sân khấu sau phần chia sẻ ở The Future of Software Engineering, Viettel Digital, 28/5/2026](/img/talks/2026-05-28/photo-on-stage.jpg)

## Agent để lại dấu vết

Dù sao thì agent cũng sẽ làm ngày càng nhiều việc hơn. Thứ quyết định team có tin được chúng hay không là
mỗi request có đi đến resolution có người chịu trách nhiệm hay không, có qua gate do người duyệt hay không,
và có để lại trace mà ai cũng đọc lại được hay không. Nếu bạn đã đưa agent vào workflow của team và đặt gate
ở chỗ khác, mình rất muốn nghe bạn đặt ở đâu.
