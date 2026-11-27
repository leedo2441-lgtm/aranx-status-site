# ARαNX -ω Termux 상태 감시 설정

## 동작 방식
- `status-monitor.js`가 상태 API를 실행합니다.
- 감시기가 실행한 `aranx93.js` 프로세스가 종료되면 `/api/status`가 `running:false`를 반환합니다.
- API 주소: `http://127.0.0.1:8787/api/status`

## 설치
1. `status-monitor.js`를 `aranx93.js`와 같은 폴더에 둡니다.
2. 그 폴더에서 `node status-monitor.js`를 실행합니다.
3. 로컬 확인: `curl http://127.0.0.1:8787/api/status`
4. 외부 사이트에서 보려면 HTTPS 터널이 8787 포트를 가리키게 하고, 터널에서 나온 실제 URL을 사용합니다.
5. `index.html`의 `STATUS_API_URL`에 해당 URL 뒤 `/api/status`를 붙여 입력합니다.

## 주의
- 봇을 따로 `node aranx93.js`로 실행하지 말고 `node status-monitor.js`로 시작해야 정확히 감시할 수 있습니다.
- 봇 프로세스가 종료돼도 상태 API가 살아 있으면 사이트에 `오프라인 · 꺼짐`으로 표시됩니다.
- Termux 자체가 종료되거나 터널이 끊기면 사이트는 API 연결 실패를 감지합니다.
- 이 감시기는 봇을 자동 재시작하지 않습니다.
