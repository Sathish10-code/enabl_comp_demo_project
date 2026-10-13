const Joi = require('joi');

const siteSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    code: Joi.string().alphanum().max(50).required(),
    region: Joi.string().min(2).max(100).required(),
    status: Joi.string().valid('active', 'inactive', 'maintenance').required()
});

const siteQuerySchema = Joi.object({
    search: Joi.string().allow('').default(''),
    region: Joi.string().allow('').default(''),
    status: Joi.string().valid('active', 'inactive', 'maintenance', '').default(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
});

const installationSchema = Joi.object({
    site_id: Joi.number().integer().positive().required(),
    equipment_type: Joi.string().min(2).max(100).required(),
    quantity: Joi.number().integer().min(1).required(),
    status: Joi.string()
        .valid('pending', 'in_progress', 'completed', 'failed')
        .required(),
    installed_at: Joi.date().iso().allow(null).default(null)
});

const validate = (schema, source = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        allowUnknown: source === 'query',
        stripUnknown: source === 'query'
    });
    if (error) {
        return res.status(400).json({
            error: 'Validation failed',
            details: error.details.map((d) => d.message)
        });
    }
    req[source] = value;
    next();
};

module.exports = {
    validateSite: validate(siteSchema, 'body'),
    validateSiteQuery: validate(siteQuerySchema, 'query'),
    validateInstallation: validate(installationSchema, 'body')
};