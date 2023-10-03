import Head from "next/head";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { useState } from "react";

const formSchema = z.object({
  currency: z.string(),
  avPurchaseValue: z.coerce.number().gte(1),
  fulfillmentCost: z.coerce.number().gte(1).lte(99),
  returnsPerYear: z.coerce.number().gte(0),
  customerTerms: z.coerce.number().gte(1),
  referrals: z.coerce.number().gte(0),
});
type Schema = z.infer<typeof formSchema>;

export default function Home() {
  const [customerLtv, setCustomerLtv] = useState<undefined | number>(undefined);

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "EUR",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setCustomerLtv(() => {
      const fulfillmentCostMultiplier = 1 - values.fulfillmentCost / 100;
      const totalCustomerReturns = values.returnsPerYear * values.customerTerms;
      const totalGrossValue =
        values.avPurchaseValue + values.avPurchaseValue * totalCustomerReturns;
      const avReferralRevenuePerCustomer = totalGrossValue * values.referrals;
      const totalGrossValueWithReferrals =
        totalGrossValue + avReferralRevenuePerCustomer;
      const totalNetValueWithReferrals =
        totalGrossValueWithReferrals * fulfillmentCostMultiplier;
      return totalNetValueWithReferrals;
    });
    console.log(values);
  }

  return (
    <>
      <Head>
        <title>ROI Calculator</title>
        <meta name="description" content="Simple ROI Calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-screen">
        <div className="flex flex-1 items-center justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="flex w-full justify-end">
                    <div className="space-y-2">
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={"EUR"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="EUR" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avPurchaseValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Purchase Value</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fulfillmentCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fulfillment Cost</FormLabel>
                    <FormControl>
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <Input type="text" placeholder="20" {...field} />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          %
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returnsPerYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Returns Per Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="8"
                        step="0.1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Terms In Years</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referrals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referrals Per Customer</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
        <div className="flex h-screen flex-1 items-center justify-center bg-violet-950 text-white">
          <h1 className="text-4xl font-bold">
            Customer LTV: {customerLtv !== undefined && "$" + customerLtv}
          </h1>
        </div>
      </main>
    </>
  );
}
