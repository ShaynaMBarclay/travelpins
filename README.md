# Pathfinder’s Tale 🌍✨

> An interactive travel storytelling experience powered by **React Three Fiber**, **Three.js**, and **Storyblok**.  
> Explore countries on a 3D globe, open books of stories, and dive into immersive chapters.

---

## 📖 Project Overview

**Pathfinder’s Tale** is a gamified storytelling platform where users can:
- Explore a **3D interactive globe** with pins for 23 countries.  
- Click a country’s pin to **open a book-like view**.  
- Browse categories such as *Food*, *Activities* and *Views*.  
- Open individual **chapters** with rich stories and media.  
- Be guided by an **onboarding tour** that introduces the app step by step.
- Get **fun fact** about a country using AI.  

We built this to combine the **wonder of exploration** with the **power of storytelling**, turning geography into a playful and immersive journey.

---

## 🏗️ How We Used Storyblok

- **Countries stored as stories** inside Storyblok (23–24 countries).  
- Each country has **dynamic blocks** for categories (Food, Activities, etc.).  
- Some categories contain **published chapters** with sample content, which are displayed in the React app.  
- Storyblok acts as the **content backend**, letting non-developers expand or modify stories easily without touching code.  

This makes Pathfinder’s Tale **scalable**: new countries and chapters can be added directly from Storyblok without redeploying the app.

---

## ⚙️ Tech Stack

- **Frontend Framework**: React 19  
- **3D & Graphics**: React Three Fiber + Three.js  
- **UI Helpers**: @react-three/drei (tooltips, controls, HTML overlays)  
- **Routing**: React Router v6  
- **Onboarding Tour**: Reactour  
- **Content Management**: Storyblok (headless CMS)  
- **Custom Shaders**: GLSL (starfield with twinkling effect)  
- **Data Management for form submission**: Firebase + Firestore
- **AI**: Gemini
---

## 📸 Screenshots
![globe](public/Screenshot%202025-09-30%20105159.png)
![country_page_book](public/Screenshot%202025-09-30%20112143.png)
![chapter_page_book](public/Screenshot%202025-09-30%20112211.png)
![ai_integration_fun_fact](public/Screenshot%202025-09-30%20112323.png)
![country_page_code](public/Screenshot%202025-09-30%20111825.png)
![starfield](public/Screenshot%202025-09-30%20111848.png)
![earthpins](public/Screenshot%202025-09-30%20111911.png)

--- 

## 🎥 Demo
*Check this video to see the demo:*

[![Video Title](https://img.youtube.com/vi/Y5BQz40pnNc/0.jpg)](https://www.youtube.com/watch?v=Y5BQz40pnNc)

---

## 📜 License
This project is licensed under the [MIT License](./LICENSE) © 2025  
**Shayna Barclay** and **Hassene Ben Amar**