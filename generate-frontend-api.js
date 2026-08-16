const fs = require('fs');

const swaggerContent = fs.readFileSync('backend-swagger.json', 'utf-8');
const swagger = JSON.parse(swaggerContent);

let typesOutput = '\n// ── Auto-generated API Types ────────────────────────\n\n';

for (const [schemaName, schema] of Object.entries(swagger.components.schemas)) {
  typesOutput += `export interface ${schemaName} {\n`;
  if (schema.properties) {
    for (const [propName, propDetails] of Object.entries(schema.properties)) {
      const isRequired = schema.required && schema.required.includes(propName) ? '' : '?';
      let typeStr = 'any';
      
      let resolvedProp = propDetails;
      if (propDetails.$ref) {
        resolvedProp = { type: propDetails.$ref.split('/').pop() };
        typeStr = resolvedProp.type;
      } else if (resolvedProp.type === 'array') {
        const itemType = resolvedProp.items?.$ref 
          ? resolvedProp.items.$ref.split('/').pop()
          : (resolvedProp.items?.type || 'any');
        typeStr = `${itemType}[]`;
      } else if (resolvedProp.enum) {
        typeStr = resolvedProp.enum.map(e => `"${e}"`).join(' | ');
      } else if (resolvedProp.type === 'string') {
        typeStr = 'string';
      } else if (resolvedProp.type === 'number' || resolvedProp.type === 'integer') {
        typeStr = 'number';
      } else if (resolvedProp.type === 'boolean') {
        typeStr = 'boolean';
      }
      
      typesOutput += `  ${propName}${isRequired}: ${typeStr};\n`;
    }
  }
  // add standard fields for Base entities if it's not a Dto
  if (!schemaName.includes('Dto')) {
    typesOutput += `  id: string;\n`;
    typesOutput += `  createdAt: string;\n`;
    typesOutput += `  updatedAt: string;\n`;
  }
  typesOutput += `}\n\n`;
}

fs.writeFileSync('generated_types.ts', typesOutput);

let apiOutput = '\n// ── Auto-generated API Functions ────────────────────\n\n';

for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, details] of Object.entries(methods)) {
    const opId = details.operationId;
    if (!opId) continue;
    
    const parts = opId.split('_');
    const controller = parts[0].replace('Controller', '');
    const action = parts[1];
    
    const isGet = method === 'get';
    const isPost = method === 'post';
    const isPatch = method === 'patch';
    const isDelete = method === 'delete';
    
    const url = path.replace('/api/v1', '');
    
    let fnName = action + controller;
    if (action === 'findAll') fnName = 'get' + controller;
    if (action === 'findOne') fnName = 'get' + controller.slice(0, -1);
    if (action === 'update') fnName = 'update' + controller.slice(0, -1);
    if (action === 'remove') fnName = 'delete' + controller.slice(0, -1);
    if (action === 'create') fnName = 'create' + controller.slice(0, -1);
    if (action === 'findByPatient') fnName = 'get' + controller + 'ByPatient';
    
    if (controller === 'Auth' || controller === 'App' || controller === 'Users') continue;
    
    let params = [];
    let urlString = `"${url}"`;
    if (url.includes('{')) {
      urlString = `\`${url.replace(/{([^}]+)}/g, '${$1}')}\``;
      const pathParams = [...url.matchAll(/{([^}]+)}/g)].map(m => m[1]);
      pathParams.forEach(p => params.push(`${p}: string`));
    }
    
    let reqBodyType = 'any';
    if (details.requestBody && details.requestBody.content['application/json']) {
       const schema = details.requestBody.content['application/json'].schema;
       if (schema.$ref) {
         reqBodyType = schema.$ref.split('/').pop();
       }
       params.push(`payload: ${reqBodyType}`);
    }
    
    let resType = 'any';
    if (action === 'findAll' || action === 'findByPatient') {
      resType = controller.slice(0, -1) + '[]';
    } else if (action === 'findOne' || action === 'create' || action === 'update') {
      resType = controller.slice(0, -1);
    } else if (action === 'remove') {
      resType = 'void';
    }
    
    apiOutput += `export async function ${fnName}(${params.join(', ')}): Promise<${resType}> {\n`;
    if (isGet) {
      apiOutput += `  const { data } = await api.get<${resType}>(${urlString});\n`;
      apiOutput += `  return data;\n`;
    } else if (isPost) {
      if (params.some(p => p.includes('payload'))) {
        apiOutput += `  const { data } = await api.post<${resType}>(${urlString}, payload);\n`;
      } else {
        apiOutput += `  const { data } = await api.post<${resType}>(${urlString});\n`;
      }
      apiOutput += `  return data;\n`;
    } else if (isPatch) {
      apiOutput += `  const { data } = await api.patch<${resType}>(${urlString}, payload);\n`;
      apiOutput += `  return data;\n`;
    } else if (isDelete) {
      apiOutput += `  await api.delete(${urlString});\n`;
    }
    
    apiOutput += `}\n\n`;
  }
}

fs.writeFileSync('generated_api.ts', apiOutput);
console.log('Done generating types and api.');
