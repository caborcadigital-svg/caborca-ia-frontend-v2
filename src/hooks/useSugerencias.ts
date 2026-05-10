export function getSugerenciasPorHora(): string[] {
  const hora = new Date().getHours();
  if (hora >= 6 && hora < 10) return ['¿Qué clima hace esta mañana?','¿Dónde desayunar en Caborca?','¿Qué noticias hay hoy?','¿Hay tráfico o reportes activos?'];
  if (hora >= 10 && hora < 14) return ['¿Dónde comer hoy?','¿Qué temperatura hace ahora?','¿Hay eventos esta semana?','¿Qué negocios están abiertos?'];
  if (hora >= 14 && hora < 18) return ['¿Dónde cenar esta noche?','¿Hay partidos hoy?','¿Qué eventos hay este fin de semana?','¿Cómo está el tráfico?'];
  if (hora >= 18 && hora < 22) return ['¿Dónde cenar en Caborca?','¿Hay eventos nocturnos?','¿Cuáles negocios siguen abiertos?','¿Resultados deportivos de hoy?'];
  return ['¿Qué clima hace hoy?','¿Qué eventos hay próximamente?','¿Dónde comer en Caborca?','¿Qué pasó hoy en Caborca?'];
}
