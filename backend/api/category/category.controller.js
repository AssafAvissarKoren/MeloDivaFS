import { categoryService } from './category.service.js'
import { loggerService } from '../../services/logger.service.js'

// List
export async function getCategories(req, res) {
    try {
        const categories = await categoryService.getAll()
        res.send(categories)
    } catch (err) {
        loggerService.error('Failed to get categories', err)
        res.status(400).send({ err: 'Failed to get categories'})
    }
}


// Read
export async function getCategory(req, res) {
    const { categoryId } = req.params
    try {
        const category = await categoryService.getById(categoryId)
        res.send(category)
    } catch (err) {
        loggerService.error('Failed to get category', err)
        res.status(400).send({ err: 'Failed to get category'})
    }
}


// Delete
export async function removeCategory(req, res) {
    const { categoryId } = req.params
    try {
        await categoryService.remove(categoryId)
        res.send('Deleted OK')
    } catch (err) {
        loggerService.error('Failed to remove category', err)
        res.status(400).send({ err: 'Failed to remove category'})
    }
}


// Create
export async function addCategory(req, res) {
    const category = req.body
    try {
        const savedCategory = await categoryService.add(category)
        res.send(savedCategory)
    } catch (err) {
        loggerService.error('Failed to save category', err)
        res.status(400).send({ err: 'Failed to save category'})
    }
}

export async function updateCategory(req, res) {
    const categoryToUpdate = req.body
    try {
        const savedCategory = await categoryService.update(categoryToUpdate)
        res.send(savedCategory)
    } catch (err) {
        loggerService.error('Failed to update category', err)
        res.status(400).send({ err: 'Failed to update category'})
    }
}

// Get Settings
export async function getSettings(req, res) {
    try {
        const settings = await categoryService.getSettings();
        res.json(settings)
    } catch (err) {
        loggerService.error('Failed to get settings', err)
        res.status(400).send({ err: 'Failed to get settings'})
    }
}
