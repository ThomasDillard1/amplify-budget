import { SelectField } from '@aws-amplify/ui-react';

export const CategoryTimeDropdown = ({onTimePeriodChange}) => {

    return(
        <SelectField onChange={(e) => onTimePeriodChange(e.target.value)} size="small">
            <option value="Total">Total</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="12 months">12 months</option>
        </SelectField>
    )
}