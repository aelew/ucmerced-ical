import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getAcademicTerms } from '@/lib/ucmerced';
import { Label } from './ui/label';

export async function TermSelector() {
  const terms = await getAcademicTerms();
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="term">Academic term</Label>
      <Select name="term">
        <SelectTrigger>
          <SelectValue placeholder="Select a term..." />
        </SelectTrigger>
        <SelectContent>
          {terms.map((term) => (
            <SelectItem key={term.code} value={term.code}>
              {term.description.replace(' (View Only)', '')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
