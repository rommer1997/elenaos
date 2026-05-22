/**
 * Script de prueba rápida para Gemini
 * Ejecutar con: node test-gemini.js
 */

const { GoogleGenerativeAI } = require('@google/generative-ai')

async function testGemini() {
  console.log('🤖 Probando conexión con Gemini...\n')

  const apiKey = 'AIzaSyC74A-A-VAOaevfmL53DpLh0d2GWLPw6cM'

  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY no está configurada')
    process.exit(1)
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    // Usar gemini-2.5-flash (el más reciente y rápido)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    console.log('📤 Enviando mensaje de prueba a Gemini...')

    const prompt = `Eres una asistente de un salón de belleza.

Genera un mensaje de WhatsApp corto y amable para una clienta llamada Carmen que lleva 45 días sin venir (su frecuencia habitual es cada 30 días). Su servicio favorito es manicura.

Máximo 50 palabras. Tono cercano y en español de España.`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    console.log('✅ ¡Gemini respondió correctamente!\n')
    console.log('📩 Mensaje generado:')
    console.log('─'.repeat(60))
    console.log(response)
    console.log('─'.repeat(60))
    console.log('\n✨ Todo funciona perfectamente!')
    console.log('🚀 Gemini está listo para usar en ElenaOS\n')
  } catch (error) {
    console.error('❌ Error al conectar con Gemini:')
    console.error(error.message)

    if (error.message.includes('API key')) {
      console.error('\n💡 Verifica que tu API key sea correcta')
    } else if (error.message.includes('quota')) {
      console.error('\n💡 Has superado el límite de 1,500 requests/día')
    } else {
      console.error('\n💡 Verifica tu conexión a internet')
    }

    process.exit(1)
  }
}

testGemini()
