/**
 * Listar modelos disponibles en Gemini
 */

const { GoogleGenerativeAI } = require('@google/generative-ai')

async function listModels() {
  const apiKey = 'AIzaSyC74A-A-VAOaevfmL53DpLh0d2GWLPw6cM'
  const genAI = new GoogleGenerativeAI(apiKey)

  try {
    console.log('📋 Listando modelos disponibles en Gemini...\n')

    // Intentar con la API REST directamente
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey)
    const data = await response.json()

    if (data.models) {
      console.log('✅ Modelos disponibles:')
      data.models.forEach(model => {
        console.log(`  - ${model.name}`)
        if (model.supportedGenerationMethods) {
          console.log(`    Métodos: ${model.supportedGenerationMethods.join(', ')}`)
        }
      })
    } else {
      console.log('❌ No se pudieron listar los modelos')
      console.log(data)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

listModels()
