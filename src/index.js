import dotenv from "dotenv";
import express from "express";
import { db } from "./db/index.js";

dotenv.config();

export const app = express();
const port = 3000;

// Add CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.get("/dashboard/stats", async (req, res) => {
  console.log("Dashboard stats requested");

  const [basvurular] = await db.query(
    `SELECT * FROM basvurular WHERE tarih >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);`,
  );

  const [aylik_red] = await db.query(
    `SELECT * FROM basvurular WHERE durum = '1' AND tarih >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);`,
  );

  const [en_fazla_il] = await db.query(
    `SELECT il_id, COUNT(*) as count FROM musteri GROUP BY il_id ORDER BY count DESC LIMIT 1;`,
  );

  const [il_adi] = await db.query(
    `SELECT ad FROM iller WHERE id = ${en_fazla_il[0].il_id};`,
  );

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
    totalRevenue: `₺${(aylik_ciro_float / 1000000).toFixed(1)}M`,
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
    console.error("Error fetching Turkey map data:", error);
    res.status(500).json({ error: "Internal server error" });
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
    console.error("Error fetching Turkey map data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/dashboard/7-gun", async (req, res) => {
  console.log("hello");

  const [results] = await db.query(`
    SELECT DATE(tarih) as date, COUNT(*) as count
    FROM basvurular
    WHERE tarih >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(tarih)
    ORDER BY DATE(tarih)
  `);
  res.json(results);
});

app.get("/commission/rates", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT DISTINCT
        s.sektor_ad as sector,
        AVG(m.komisyon_id) as rate
      FROM musteri m
      JOIN sektor s ON s.id = m.sektor_id
      WHERE m.sektor_id IS NOT NULL
        AND m.komisyon_id IS NOT NULL
      GROUP BY s.sektor_ad
    `);

    const rates = results.reduce((acc, item) => {
      acc[item.sector] = item.rate;
      return acc;
    }, {});

    res.json(rates);
  } catch (error) {
    console.error("Error fetching commission rates:", error);
    res
      .status(500)
      .json({ error: "Komisyon oranları alınırken bir hata oluştu" });
  }
});

app.get("/commission/summary", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        s.sektor_ad as sector,
        AVG(m.komisyon_id) as rate,
        SUM(m.ciro) as revenue,
        SUM(m.ciro * m.komisyon_id / 100) as commission
      FROM musteri m
      JOIN sektor s ON s.id = m.sektor_id
      WHERE m.sektor_id IS NOT NULL 
        AND m.komisyon_id IS NOT NULL 
        AND m.ciro IS NOT NULL
      GROUP BY s.sektor_ad
      ORDER BY commission DESC
    `);

    res.json(results);
  } catch (error) {
    console.error("Error fetching commission summary:", error);
    res.status(500).json({ error: "Komisyon özeti alınırken bir hata oluştu" });
  }
});

app.get('/demographics/regional', async (req, res) => {
  try {
    // Get regional stats
    const [regionalStats] = await db.query(`
      SELECT 
        i.bolge as region,
        COUNT(*) as basvuru_count,
        SUM(CASE WHEN b.durum = '3' THEN 1 ELSE 0 END) as onay_count,
        SUM(CASE WHEN b.durum = '1' THEN 1 ELSE 0 END) as red_count,
        SUM(CASE WHEN b.durum = '3' THEN m.ciro ELSE 0 END) as total_ciro
      FROM basvurular b
      JOIN musteri m ON b.musteri_id = m.id
      JOIN iller i ON m.il_id = i.id
      GROUP BY i.bolge
      ORDER BY basvuru_count DESC
    `);

    // Get sector distribution by region
    const [sectorStats] = await db.query(`
      SELECT 
        i.bolge as region,
        s.sektor_ad as sector,
        COUNT(*) as count
      FROM basvurular b
      JOIN musteri m ON b.musteri_id = m.id
      JOIN iller i ON m.il_id = i.id
      JOIN sektor s ON m.sektor_id = s.id
      GROUP BY i.bolge, s.sektor_ad
      ORDER BY i.bolge, count DESC
    `);

    // Get top cities
    const [topCities] = await db.query(`
      SELECT 
        i.ad as city,
        COUNT(*) as count
      FROM basvurular b
      JOIN musteri m ON b.musteri_id = m.id
      JOIN iller i ON m.il_id = i.id
      GROUP BY i.ad
      ORDER BY count DESC
      LIMIT 5
    `);

    res.json({
      regionalStats: regionalStats,
      sectorDistribution: sectorStats,
      topCities: {
        labels: topCities.map(c => c.city),
        values: topCities.map(c => c.count)
      }
    });
  } catch (error) {
    console.error('Error fetching demographic data:', error);
    res.status(500).json({ error: 'Demografik veriler alınırken hata oluştu' });
  }
});

app.get('/basvuru/analytics', async (req, res) => {
  try {
    // Get main stats with error handling for null values
    const [[stats]] = await db.query(`
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN durum = '3' THEN 1 ELSE 0 END) as onay_count,
        SUM(CASE WHEN durum = '1' THEN 1 ELSE 0 END) as red_count,
        COALESCE(SUM(CASE WHEN durum = '3' THEN m.ciro ELSE 0 END), 0) as total_ciro
      FROM basvurular b
      LEFT JOIN musteri m ON b.musteri_id = m.id
    `);

    // Get red sebepleri with proper join
    const [redSebepler] = await db.query(`
      SELECT 
        rs.sebep as red_sebep,
        COUNT(*) as count
      FROM basvurular b
      JOIN red_sebepleri rs ON b.red_sebep_id = rs.id
      WHERE b.durum = '1'
      GROUP BY rs.id, rs.sebep
      ORDER BY count DESC
    `);

    // Get sector stats with all proper joins
    const [sektorData] = await db.query(`
      SELECT 
        COALESCE(s.sektor_ad, 'Diğer') as sektor_ad,
        b.durum,
        COALESCE(rs.sebep, 'Belirtilmemiş') as red_sebep,
        COUNT(*) as count
      FROM basvurular b
      LEFT JOIN musteri m ON b.musteri_id = m.id
      LEFT JOIN sektor s ON m.sektor_id = s.id
      LEFT JOIN red_sebepleri rs ON b.red_sebep_id = rs.id
      GROUP BY s.sektor_ad, b.durum, rs.sebep
      ORDER BY s.sektor_ad, b.durum
    `);

    // Format the response with default values
    res.json({
      stats: {
        approvedCount: stats.onay_count || 0,
        totalCount: stats.total_count || 0,
        rejectedCount: stats.red_count || 0,
        totalRevenue: `₺${((stats.total_ciro || 0) / 1000000).toFixed(1)}M`
      },
      redSebepler: {
        labels: redSebepler.map(r => r.red_sebep),
        values: redSebepler.map(r => r.count)
      },
      sektorData: sektorData
    });
  } catch (error) {
    console.error('Error fetching application analytics:', error);
    res.status(500).json({ error: 'Veriler alınırken hata oluştu' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
