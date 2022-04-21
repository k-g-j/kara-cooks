import { useState } from 'react'
import { addDoc } from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../firebase.config'

export default function Form({ recipesCollectionRef, setPopupActive }) {

  const [form, setForm] = useState({
    title: '',
    desc: '',
    ingredients: [],
    steps: [],
    images: [],
  })
  const [images, setImages] = useState([])
  const [progress, setProgress] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.desc || !form.ingredients || !form.steps) {
      alert('Please fill out all the fields')
      return
    }

    addDoc(recipesCollectionRef, form)
    setForm({
      title: '',
      desc: '',
      link: '',
      ingredients: [],
      steps: [],
      images: [],
    })
    setPopupActive(false)
  }
  const handleIngredient = (e, i) => {
    const ingredientsClone = [...form.ingredients]

    ingredientsClone[i] = e.target.value
    setForm({ ...form, ingredients: ingredientsClone })
  }

  const handleStep = (e, i) => {
    const stepsClone = [...form.steps]

    stepsClone[i] = e.target.value
    setForm({ ...form, steps: stepsClone })
  }

  const handleIngredientCount = () => {
    setForm({ ...form, ingredients: [...form.ingredients, ''] })
  }
  const handleStepCount = () => {
    setForm({ ...form, steps: [...form.steps, ''] })
  }
  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i]
      newImage.id = Math.random()
      setImages((prevState) => [...prevState, newImage])
    }
  }

  const handleImages = () => {
    const urls =[]
    return new Promise((resolve, reject) => {
      images.map((image) => {
        const imageRef = ref(storage, `images/${image.name}`)
        const upload = uploadBytesResumable(imageRef, image)
        upload.on(
          'state_changed',
          (snapShot) => {
            const progress =
              (snapShot.bytesTransferred / snapShot.totalBytes) * 100
            setProgress(progress)
          },
          (error) => {
            reject(error)
          },
          async () => {
            try {
              const url = await getDownloadURL(imageRef)
              resolve(urls.push(url))
            } catch (error) {
              reject(error)
            }
          },
        )
      })
      let imagesClone = [...form.images]
      imagesClone = urls
      setForm({ ...form, images: imagesClone })
    })
  }
  return (
          <div className="popup">
          <div className="popup-inner">
            <h2>Add a new recipe</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
          
              <div className="form-group">
                <label>Link</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </div>
          
              <div className="form-group">
                <label>Description</label>
                <textarea
                  type="text"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Ingredients</label>
                {form.ingredients.map((ingredient, i) => (
                  <input
                    type="text"
                    key={i}
                    value={ingredient}
                    onChange={(e) => handleIngredient(e, i)}
                  />
                ))}
                <button type="button" onClick={handleIngredientCount}> Add ingredient </button>
              </div>

              <div className="form-group">
                <label>Steps</label>
                {form.steps.map((step, i) => (
                  <textarea
                    type="text"
                    key={i}
                    value={step}
                    onChange={(e) => handleStep(e, i)}
                  />
                ))}
                <button type="button" onClick={handleStepCount}> Add step </button>
              </div>

              <div className="form-group">
                <progress value={progress} max="100" />
                <br />
            <br />
            <label htmlFor="file-upload" className="custom-file-upload">Browse</label>
                <input id="file-upload" type="file" multiple onChange={handleChange} />
                <button type="button" onClick={handleImages}> Click to upload pics</button>
              </div>

              <div className="buttons">
                <button type="submit">Submit</button>
                <button type="button" className="remove" onClick={() => setPopupActive(false)} > Close </button>
              </div>
            </form>
          </div>
        </div>
  )
}
