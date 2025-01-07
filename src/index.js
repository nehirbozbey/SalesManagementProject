import dotenv from "dotenv";
import express from "express";
import { db } from "./db/index.js";

dotenv.config();

export const app = express();
const port = 3000;

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get("/dashboard/stats", async (req, res) => {
  console.log("Dashboard stats requested");

  const [basvurular] = await db.query(`SELECT * FROM basvurular WHERE tarih >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);`);

  const [aylik_red] = await db.query(`SELECT * FROM basvurular WHERE durum = '1' AND tarih >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);`);

  const [en_fazla_il] = await db.query(`SELECT il_id, COUNT(*) as count FROM musteri GROUP BY il_id ORDER BY count DESC LIMIT 1;`);

  const [il_adi] = await db.query(`SELECT ad FROM iller WHERE id = ${en_fazla_il[0].il_id};`);

  const [aylik_ciro] = await db.query(`
    SELECT SUM(m.ciro / ko.oran) as total_ciro
    FROM basvurular b
    JOIN musteri m ON b.musteri_id = m.id
    JOIN komisyon_oran ko ON m.komisyon_id = ko.id
    WHERE b.durum = '3'
    AND b.tarih >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  `);

  const aylik_ciro_float = parseFloat(aylik_ciro[0].total_ciro || 0).toFixed(2);

  console.log(aylik_ciro_float);

  res.json({
    dailyApplications: basvurular.length,
    rejections: aylik_red.length,
    totalRevenue: `₺${(aylik_ciro_float/1000000).toFixed(1)}M`,
    activeRegion: il_adi[0].ad,
  });
});

app.get("/dashboard/turkiye", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT i.ad as city, COUNT(b.id) as count
      FROM basvurular b
      JOIN musteri m ON b.musteri_id = m.id
      JOIN iller i ON m.il_id = i.id
      WHERE b.tarih >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY i.ad
      ORDER BY count DESC
    `);

    // Convert array of results to object with city names as keys
    const cityData = results.reduce((acc, curr) => {
      acc[curr.city] = curr.count;
      return acc;
    }, {});

    res.json(cityData);
  } catch (error) {
    console.error('Error fetching Turkey map data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/dashboard/turkiye", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT i.ad as city, COUNT(b.id) as count
      FROM basvurular b
      JOIN musteri m ON b.musteri_id = m.id
      JOIN iller i ON m.il_id = i.id
      WHERE b.tarih >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY i.ad
      ORDER BY count DESC
    `);

    // Convert array of results to object with city names as keys
    const cityData = results.reduce((acc, curr) => {
      acc[curr.city] = curr.count;
      return acc;
    }, {});

    res.json(cityData);
  } catch (error) {
    console.error('Error fetching Turkey map data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/dashboard/7-gun', async (req, res) => {
  console.log("hello")

  const [results] = await db.query(`
    SELECT DATE(tarih) as date, COUNT(*) as count
    FROM basvurular
    WHERE tarih >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(tarih)
    ORDER BY DATE(tarih)
  `);
  res.json(results);
});

app.get('/commission/rates', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT DISTINCT
        s.sektor_ad as sector,
        m.komisyon_id as rate
      FROM musteri m
      JOIN sektor s ON s.id = m.sektor_id
      WHERE m.sektor_id IS NOT NULL
        AND m.komisyon_id IS NOT NULL
    `);

    const rates = results.reduce((acc, item) => {
      acc[item.sector] = item.rate;
      return acc;
    }, {});

    res.json(rates);
  } catch (error) {
    console.error('Error fetching commission rates:', error);
    res.status(500).json({ error: 'Komisyon oranları alınırken bir hata oluştu' });
  }
});

app.get('/commission/summary', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        s.sektor_ad as sector,
        m.komisyon_id as rate,
        SUM(m.ciro) as revenue,
        SUM(m.ciro * m.komisyon_id / 100) as commission
      FROM musteri m
      JOIN sektor s ON s.id = m.sektor_id
      WHERE m.sektor_id IS NOT NULL 
        AND m.komisyon_id IS NOT NULL 
        AND m.ciro IS NOT NULL
      GROUP BY s.sektor_ad, m.komisyon_id
      ORDER BY commission DESC
    `);

    res.json(results);
  } catch (error) {
    console.error('Error fetching commission summary:', error);
    res.status(500).json({ error: 'Komisyon özeti alınırken bir hata oluştu' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
