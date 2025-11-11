import { useEffect, useMemo, useState } from 'react';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticateFetch';
import { OCS_API_URL } from '../../helpers/constants';
import { ChevronDown, ChevronUp, LoaderCircle, MapPlus } from 'lucide-react';
import {
  DEFAULT_BTN,
  DEFAULT_BTN_DISABLED,
  DEFAULT_H1,
  DEFAULT_INPUT,
  DEFAULT_SPINNER,
} from '../../helpers/style-contants';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { IActivity } from '@ocs/types';
import { useDispatch } from 'react-redux';
import { setActivities } from '../../store/activitiesSlice';
import { getFormattedDistance, getFormattedDuration } from '@ocs/library';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';

const Activities: React.FC = () => {
  const dispatch = useDispatch();
  const authenticatedFetch = useAuthenticatedFetch();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const mapUrl = `${OCS_API_URL}/activity/get-user-activities`;
      let response = await authenticatedFetch(mapUrl);

      if (response.ok) {
        return (await response.json()).activities as IActivity[];
      }
    },
  });

  useEffect(() => {
    if (activities) {
      dispatch(setActivities(activities));
    }
  }, [activities, dispatch]);

  const formattedActivities = useMemo(() => {
    if (!activities) return [];
    return activities.map((a) => {
      const { coordinates } = a.cleanUpRoute;
      const startLocation = coordinates?.[0];
      const endLocation = coordinates?.[coordinates.length - 1];
      const date = new Date(a.activityDate).toLocaleDateString();

      return {
        id: a.id,
        activityDate: date,
        mostCommonItem: a.mostCommonItem,
        trashWeight: a.trashWeight,
        duration: getFormattedDuration(a.cleanUpRoute.duration),
        distance: getFormattedDistance(a.cleanUpRoute.distance),
        startLocation,
        endLocation,
      };
    });
  }, [activities]);

  // React Table Config
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columnHelper =
    createColumnHelper<(typeof formattedActivities)[number]>();

  // Build columns
  const columns = [
    columnHelper.accessor('activityDate', {
      header: () => 'Activity Date',
      cell: (info) => (
        <Link
          to={`/activity-details/${info.row.original.id}`}
          className='text-green-600 hover:underline'
        >
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('mostCommonItem', { header: 'Most Common Item' }),
    columnHelper.accessor('trashWeight', { header: 'Est. Weight (lbs)' }),
    columnHelper.accessor('duration', { header: 'Duration' }),
    columnHelper.accessor('distance', { header: 'Distance' }),
    columnHelper.accessor('startLocation', {
      header: 'Start Location',
      cell: (info) => info.getValue()?.join(', '),
    }),
    columnHelper.accessor('endLocation', {
      header: 'End Location',
      cell: (info) => info.getValue()?.join(', '),
    }),
  ];

  // useReactTable config, state, hooks
  const table = useReactTable({
    data: formattedActivities,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <h1 className={DEFAULT_H1}>Your Cleanup Activities</h1>
      <div className='flex items-center justify-between mb-4'>
        {/* Search Bar */}
        <input
          type='text'
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Search activities...'
          className={`${DEFAULT_INPUT} max-w-sm mr-3`}
        />
        <button className={DEFAULT_BTN}>
          <Link to='/log-activity' className='flex'>
            <MapPlus className='mr-2' /> Log New Activity
          </Link>
        </button>
        {isLoading && <LoaderCircle className={`${DEFAULT_SPINNER} ml-2`} />}
      </div>
      {!isLoading && formattedActivities.length > 0 && (
        <div className='overflow-x-auto mt-3'>
          <table className='table-auto w-full border-collapse'>
            <thead className='bg-gray-200'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className='px-4 py-2 text-left hover:cursor-pointer select-none'
                    >
                      <div className='flex items-center'>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {/* define asc and desc, then index based on the sorted col to determine if its sorted */}
                        {{
                          asc: <ChevronUp />,
                          desc: <ChevronDown />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className='border-b'>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='px-4 py-2'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className='flex items-center justify-between mt-4'>
            <div className='space-x-2'>
              <button
                className={`${
                  table.getCanPreviousPage()
                    ? DEFAULT_BTN
                    : DEFAULT_BTN_DISABLED
                }`}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <button
                className={`${
                  table.getCanNextPage() ? DEFAULT_BTN : DEFAULT_BTN_DISABLED
                }`}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
            <div>
              Page{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className='border px-2 py-1 rounded'
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
