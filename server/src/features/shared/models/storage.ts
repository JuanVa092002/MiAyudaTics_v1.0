import { Schema, model, Model } from 'mongoose'

interface IStorage {
  url: string
  filename: string
}

const storageSchema = new Schema<IStorage>({
  url: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
})

const Storage = model<IStorage, Model<IStorage>>('Storage', storageSchema)
export default Storage

