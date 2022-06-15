import React from 'react';

function StateSelect({ register }) {
  return (
    <>
      <label className="text-sm">State</label>
      <select
        {...register('state')}
        className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
      >
        <option value={'AC'}>Acre</option>
        <option value={'AL'}>Alagoas</option>
        <option value={'AP'}>Amapá</option>
        <option value={'AM'}>Amazonas</option>
        <option value={'BA'}>Bahia</option>
        <option value={'CE'}>Ceará</option>
        <option value={'ES'}>Espírito Santo</option>
        <option value={'GO'}>Goiás</option>
        <option value={'MA'}>Maranhão</option>
        <option value={'MT'}>Mato Grosso</option>
        <option value={'MS'}>Mato Grosso do Sul</option>
        <option value={'MG'}>Minas Gerais</option>
        <option value={'PA'}>Pará</option>
        <option value={'PB'}>Paraíba</option>
        <option value={'PR'}>Paraná</option>
        <option value={'PE'}>Pernambuco</option>
        <option value={'PI'}>Piauí</option>
        <option value={'RJ'}>Rio de Janeiro</option>
        <option value={'RN'}>Rio Grande do Norte</option>
        <option value={'RS'}>Rio Grande do Sul</option>
        <option value={'RO'}>Rondônia</option>
        <option value={'RR'}>Roraima</option>
        <option value={'SC'}>Santa Catarina</option>
        <option value={'SP'}>São Paulo</option>
        <option value={'SE'}>Sergipe</option>
        <option value={'TO'}>Tocatins</option>
        <option value={'DF'}>Distrito Federal</option>
      </select>
    </>
  );
}

export default StateSelect;
