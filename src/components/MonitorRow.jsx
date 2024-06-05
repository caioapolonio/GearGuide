import { Table } from "@radix-ui/themes";
import { Button, Modal, Flex, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";

const MonitorRow = ({
  monitor,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchMonitorsData,
  handleInputChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteMonitor = async (monitorId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this monitor?",
    );
    if (confirmed) {
      const { data, error } = await supabase
        .from("monitors")
        .delete()
        .eq("monitor_id", monitorId);
      if (error) {
        console.error("Error deleting monitor:", error.message);
      } else {
        fetchMonitorsData();
        console.log("Monitor deleted successfully:", data);
      }
    }
  };

  const handleUpdateMonitor = async (e) => {
    const { monitor_id, name, image_url } = e;
    const { data, error } = await supabase
      .from("monitors")
      .update({ name: name, image_url: image_url })
      .eq("monitor_id", monitor_id);
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Monitor edited successfully!");
    fetchMonitorsData();
    console.log("EVENT", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Row align={"center"}>
        <Table.RowHeaderCell>{monitor.name}</Table.RowHeaderCell>
        <Table.Cell>
          <img src={monitor.image_url} alt="" className="h-16 w-16" />
        </Table.Cell>
        <Table.Cell>
          <Button variant="outline" onClick={open}>
            Edit
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDeleteMonitor(monitor.monitor_id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>

      <Modal opened={opened} onClose={close} title="Edit Monitor" centered>
        <form
          onSubmit={handleSubmit(handleUpdateMonitor)}
          onChange={handleInputChange}
        >
          <TextInput
            label="ID"
            defaultValue={monitor.monitor_id}
            readOnly
            {...register("monitor_id", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
            defaultValue={monitor.name}
            {...register("name", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
          <TextInput
            label="Image"
            placeholder="Image url"
            mt="sm"
            defaultValue={monitor.image_url}
            {...register("image_url", {
              required: {
                value: true,
                message: "Preencha o campo de imagem",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.image_url && (
            <p className="text-sm text-red-600">{errors.image_url.message}</p>
          )}
          <Flex justify="center" align="center">
            <Button fullWidth type="submit" mt="sm">
              Edit Monitor
            </Button>
          </Flex>
          <Flex>
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default MonitorRow;
