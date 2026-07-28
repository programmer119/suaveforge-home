# SuaveForge v7.1 기술 스택 검수 기록

검수 기준:

- 기존 사이트의 프로젝트 데이터
- 프로필매니저 포트폴리오 원문에 기록된 `사용 기술/도구`
- Accident Content Studio R7~R23 검증 보고서
- 실제 구현 근거가 없는 인기 기술은 추가하지 않음

## 반영한 주요 누락

- ACS: OpenAI Responses API, Windows DPAPI, Google Drive Desktop
- 이미지 수집 도구: Image Crawling, Metadata/License Filtering, CSV Metadata
- Visual FoxPro PDF 모듈: Node.js, GitHub Actions, GitHub Pages
- 기질검사 PDF: Node.js, REST API, Docker, Google Cloud Build, GitHub Actions, GitHub Pages, SVG, JSON
- 키오스크: Go, Google Sheets
- 농장 방역 AI: TensorFlow, PyTorch, STGNN
- MCX: Kotlin, Jetpack Compose
- 모아페스타: Flutter, Laravel, PHP
- 특허 SaaS: Python, React, Node.js, Sass
- TTS/MRCP: React, TTS, MRCP
- LMS: Python, React, Node.js
- 치료 기록 앱: SvelteKit, Svelte, Node.js, MySQL
- 광고·CRM: Node.js, MySQL

## 의도적으로 추가하지 않은 항목

의료기기 재고관리 자료에는 여러 언어와 엔진이 한꺼번에 나열되어 있었지만, 본문상 실제 구현 기술이 아니라 “요청 시 선택 가능한 기술”에 가까웠습니다. 실제 사용 근거가 없는 기술을 사이트에 올리지 않기 위해 기존 웹 데모 스택만 유지했습니다.
