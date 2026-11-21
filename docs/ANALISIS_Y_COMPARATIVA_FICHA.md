# 📋 Auditoría y Análisis Comparativo: Ficha Técnica vs Avance Actual
**Proyecto: Cosecha Justa**  
**Institución: Universidad Politécnica de Querétaro (UPQ)**  
**Fecha de Revisión: Noviembre 2026**

---

## 🔍 Resumen Ejecutivo

Se realizó una revisión exhaustiva cruzando la **Ficha de Registro de Proyecto (Septiembre 2026)** contra:
1. El **Reporte de Estadía** en formato PDF (41 páginas).
2. El documento **Diseño de Datos** en PDF (10 páginas).
3. El paquete de recursos **Diagramas_Cosecha_Justa.zip** (32 diagramas generados en Mermaid y PNG).

A continuación se detallan los hallazgos, fortalezas, discrepancias detectadas y recomendaciones puntuales para asegurar una calificación perfecta ante el asesor y revisores.

---

## 1. Comparativa de Requerimientos Institucionales

| Elemento de la Ficha UPQ | Estado en Avance Actual | Observación y Detalle |
| :--- | :---: | :--- |
| **Arquitectura Desacoplada** |  **100% Cumplido** | Diseñada exactamente con React Native (móvil), Laravel (web admin), FastAPI (API central) y PostgreSQL (BD compartida). Ningún frontend accede a la BD sin pasar por la API. |
| **Descripción de la solución con diagrama** |  **100% Cumplido** | Figura 4.1.1 en Reporte de Estadía explicando los 4 bloques y flujos de datos. |
| **Requerimientos Funcionales por interfaz y API** |  **100% Cumplido** | - Productor (`RF-PRO-01` a `11`): 11 requerimientos.<br>- Consumidor (`RF-CON-01` a `09`): 9 requerimientos.<br>- Administrador (`RF-ADM-01` a `09`): 9 requerimientos.<br>- API (`OBJ-API-01` a `08`): 8 objetivos. |
| **Requerimientos No Funcionales** |  **100% Cumplido** | 10 RNF formulados con métricas medibles (`RNF-01` a `RNF-10`). |
| **Casos de Uso (1 por interfaz + API)** |  **100% Cumplido** | Figuras 4.1.2 a 4.1.5 (Productor, Consumidor, Admin, API). |
| **Diagramas de Secuencia (1 por cada caso de uso)** | ⚠️ **Parcial en PDF /  Completo en ZIP** | **Discrepancia crítica**: En el cuerpo del reporte solo se incluyeron 2 diagramas (Fig 4.1.6 y 4.1.7). Sin embargo, en el ZIP están creados los **32 diagramas** de secuencia (`SEC-PRO-01..11`, `SEC-CON-01..09`, `SEC-ADM-01..09`, `SEC-API-02,07,08`). **Acción necesaria**: Insertarlos en el reporte escrito o en un anexo formal. |
| **Diagrama de Componentes** |  **100% Cumplido** | Figura 4.1.8 completa en reporte y ZIP. |
| **Diccionario de Datos (PostgreSQL)** |  **100% Cumplido** | 17 tablas descritas con tipos de datos, restricciones de nulidad, llaves PK/FK/UK y reglas de negocio. |
| **Cardinalidades de Tablas** |  **100% Cumplido** | 26 relaciones tabuladas con notación estándar (1:0..N, 1:1..N, 1:0..1). |
| **Diagrama Relacional de BD** |  **Disponible en ZIP** | El archivo `ER_Diagrama_relacional.png` existe en el ZIP pero no estaba visible en el PDF principal. Ya fue integrado al repositorio. |
| **Mockups de Interfaces Móvil y Web** | ❌ **Pendiente** | La ficha solicita mockups de todas las posibles interfaces para la Etapa 1. Deben anexarse pantallas (Figma o wireframes) antes de la entrega final. |

---

## 2. Discrepancias Formales Detectadas

1. **Número de Estudiantes**:
   - En la **Ficha de Registro** dice: `No de estudiantes: 2`.
   - En la **Portada del Reporte** aparecen **4 estudiantes**:
     - *Morales De León Dulce María*
     - *Enriquez Escamilla Javier Guerson*
     - *Martínez Badillo Andrés*
     - *Villafuerte Armenta Gabriel Iván*
   - En la página 17 (Restricciones) también se menciona "equipo de cuatro estudiantes".
   - 👉 **Recomendación**: Actualizar la Ficha de Registro de Proyecto para que indique formalmente 4 estudiantes si la institución lo avala, o justificar la conformación del equipo para evitar observaciones administrativas.

2. **Enlaces Externos vs Documento Integrado**:
   - En la página 41 del reporte se colocaron enlaces a Google Docs (`https://docs.google.com/...`).
   - Para las revisiones formales de estadía, los sinodales suelen solicitar que la información esté contenida directamente en el documento o en apéndices impresos/PDF.

---

## 3. Estado de los Entregables por Avance

- **Etapa 1 (Análisis y Diseño)**: 95% listo (solo falta incrustar los mockups de interfaces y diagramas de secuencia en el reporte).
- **Avance 1 (FrontEnd Móvil y Web + Repositorio + Video)**: Repositorio inicializado y estructurado desacopladamente; listo para codificar pantallas de React Native y vistas de Laravel.
- **Avance 2 (API Funcional + Base de Datos + Video)**: Base de datos diseñada con script de inicialización (`01_init_schema.sql`), Docker orquestado y API FastAPI implementada con modelos SQLAlchemy y endpoints protegidos por JWT.
