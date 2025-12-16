# Final Task App with Monitoring

Небольшое веб-приложение на **Node.js (Express)**, представляющее собой простой лендинг с REST API и встроенным мониторингом на базе **Prometheus** и **Grafana**. Приложение упаковано в Docker и готово к запуску как отдельно, так и в составе Docker Compose.

## Возможности

* HTTP-сервер на Node.js (Express)
* Лендинг-страница (GET `/`)
* REST API для проверки состояния сервиса
* Экспорт метрик в формате Prometheus
* Контейнеризация с Docker (non-root, multi-stage build)
* Мониторинг и визуализация метрик (Prometheus + Grafana)

---

## Доступные эндпойнты

| Endpoint   | Метод | Описание                                       |
| ---------- | ----- | ---------------------------------------------- |
| `/`        | GET   | Лендинг-страница                               |
| `/health`  | GET   | Проверка состояния сервиса (`{"status":"ok"}`) |
| `/metrics` | GET   | Метрики Prometheus                             |

---

## Docker-образ

Готовый Docker-образ опубликован в Docker Hub:

```
docker.io/ gennadiyggman/landing-app:latest
```

### Запуск контейнера

```bash
docker run -p 80:3000  gennadiyggman/landing-app:latest
```

После запуска:

* Приложение: [http://localhost](http://localhost)
* Health-check: [http://localhost/health](http://localhost/health)

---

## Запуск с мониторингом (Docker Compose)

В проекте предусмотрен `docker-compose.yml`, который поднимает:

* Node.js приложение
* Prometheus
* Grafana с преднастроенным дашбордом

### Запуск

```bash
docker-compose up -d
```

### Доступ к сервисам

| Сервис     | URL                                            |
| ---------- | ---------------------------------------------- |
| Приложение | [http://localhost:8080](http://localhost:8080) |
| Prometheus | [http://localhost:9090](http://localhost:9090) |
| Grafana    | [http://localhost:3000](http://localhost:3000) |

### Grafana

* Логин: `admin`
* Пароль: `admin`
* Источник данных Prometheus настроен автоматически
* Дашборд загружается через provisioning

---

## Метрики на дашборде Grafana

Преднастроенный дашборд отображает ключевые метрики приложения:

* **Request Rate** — количество HTTP-запросов в секунду
* **Error Rate** — частота ошибок (5xx)
* **Request Duration (p95)** — 95-й перцентиль времени ответа

Метрики собираются библиотекой `prom-client` и автоматически обрабатываются Prometheus.

---

## Используемые технологии

* Node.js 18
* Express
* prom-client
* Docker / Docker Compose
* Prometheus
* Grafana

---

## Назначение проекта

Проект предназначен для учебных целей и демонстрирует базовые DevOps-практики:

* контейнеризация приложения
* публикация образа
* мониторинг и observability
* инфраструктура как код (IaC)
